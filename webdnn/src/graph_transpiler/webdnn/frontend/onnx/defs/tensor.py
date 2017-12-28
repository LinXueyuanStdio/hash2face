"""
https://github.com/onnx/onnx/blob/09ada0f107f1cc1877f9194475c98d2d8512e188/onnx/defs/tensor/defs.cc
"""
import numpy as np

from webdnn.frontend.onnx.converter import ONNXConverter, attribute_dict
from webdnn.frontend.onnx.type_hint import INodeProto
from webdnn.graph.axis import AxisKeyDict
from webdnn.graph.operators.concat import Concat
from webdnn.graph.operators.depth2space import Depth2Space
from webdnn.graph.operators.reshape import Reshape
from webdnn.graph.operators.space2depth import Space2Depth
from webdnn.graph.operators.split_axis import SplitAxis
from webdnn.graph.operators.tile import Tile
from webdnn.graph.operators.transpose import Transpose
from webdnn.graph.order import Order, OrderNCHW
from webdnn.graph.variables.constant_variable import ConstantVariable
from webdnn.util import console
from webdnn.util.misc import mul


@ONNXConverter.register_handler("Cast")
def _convert_cast(converter: ONNXConverter, onnx_op: INodeProto):
    console.warning("[ONNXConverter] Operator \"Cast\" is ignored")
    x = converter.get_variable(onnx_op.input[0])
    converter.set_variable(onnx_op.output[0], x)


@ONNXConverter.register_handler("Reshape")
def _convert_reshape(converter: ONNXConverter, onnx_op: INodeProto):
    x = converter.get_variable(onnx_op.input[0])
    attrs = attribute_dict(onnx_op)
    out_shape = [r if s == 0 else s for r, s in zip(x.shape, attrs["shape"].ints)]

    if -1 in out_shape:
        i = out_shape.index(-1)
        out_shape.remove(-1)
        out_shape.insert(i, x.size // mul(out_shape))

    out_order = Order([None] * len(out_shape))

    y, = Reshape(None, in_order=x.order, out_order=out_order, out_shape=out_shape)(x)
    converter.set_variable(onnx_op.output[0], y)


@ONNXConverter.register_handler("Concat")
def _convert_concat(converter: ONNXConverter, onnx_op: INodeProto):
    xs = [converter.get_variable(v) for v in onnx_op.input]
    for x in xs[1:]:
        xs[0].order.unify(x.order)

    attrs = attribute_dict(onnx_op)
    axis = xs[0].order.axes[attrs["axis"].i]

    y, = Concat(None, axis=axis)(*xs)
    converter.set_variable(onnx_op.output[0], y)


@ONNXConverter.register_handler("Split")
def _convert_split(converter: ONNXConverter, onnx_op: INodeProto):
    x = converter.get_variable(onnx_op.input[0])

    attrs = attribute_dict(onnx_op)

    axis = x.order.axes[attrs["axis"].i]

    if "split" not in attrs:
        raise NotImplementedError("[ONNXConverter] Operator \"Split\" without \"split\" parameter is not supported yet.")
    split = attrs["split"].ints
    sections = np.cumsum(split).tolist()[:-1]

    ys = SplitAxis(None, axis=axis, sections=sections)(x)
    for i, y in enumerate(ys):
        converter.set_variable(onnx_op.output[i], y)


@ONNXConverter.register_handler("Slice")
def _convert_slice(converter: ONNXConverter, onnx_op: INodeProto):
    raise NotImplementedError("[ONNXConverter] Operator \"Slice\" is not supported yet.")


@ONNXConverter.register_handler("Transpose")
def _convert_transpose(converter: ONNXConverter, onnx_op: INodeProto):
    x = converter.get_variable(onnx_op.input[0])
    attrs = attribute_dict(onnx_op)

    y, = Transpose(None)(x)
    perm = list(attrs["perm"].ints if "perm" in attrs else reversed(range(x.ndim)))
    y.change_order(Order([x.order.axes[i] for i in perm]))

    converter.set_variable(onnx_op.output[0], y)


@ONNXConverter.register_handler("Gather")
def _convert_gather(converter: ONNXConverter, onnx_op: INodeProto):
    raise NotImplementedError("[ONNXConverter] Operator \"Gather\" is not supported yet.")


@ONNXConverter.register_handler("Squeeze")
def _convert_squeeze(converter: ONNXConverter, onnx_op: INodeProto):
    x = converter.get_variable(onnx_op.input[0])

    attrs = attribute_dict(onnx_op)
    axes = [x.order.axes[i] for i in attrs["axes"].ints]

    y = x.squeeze(axes)
    converter.set_variable(onnx_op.output[0], y)


@ONNXConverter.register_handler("Pad")
def _convert_pad(converter: ONNXConverter, onnx_op: INodeProto):
    x = converter.get_variable(onnx_op.input[0])

    attrs = attribute_dict(onnx_op)

    pads = attrs["pads"].ints
    if len(pads) != 2 * x.ndim:
        raise ValueError("[ONNXConverter] The length of parameter \"pads\" in \"Pad\" node must be double of input tensor's dimension")
    pads_begin = pads[:x.ndim]
    pads_end = pads[x.ndim:]

    mode = attrs["mode"].s if "mode" in attrs else b"constant"
    value = attrs["value"].f if "value" in attrs else 0
    constant_values = ConstantVariable(np.full([1] * x.ndim, value), x.order)

    for pad_begin, pad_end, axis in zip(pads_begin, pads_end, x.order.axes):
        xs = []

        if pad_begin > 0:
            if mode == b"constant":
                multiplier = AxisKeyDict(x.order.axes, [pad_begin if a == axis else x.shape_dict[a] for a in x.order.axes])
                xs.append(Tile(None, multiplier)(constant_values)[0])

            elif mode == b"reflect":
                slices = [slice(pad_begin, 0, -1) if a == axis else slice(None) for a in x.order.axes]
                xs.append(x[slices])

            elif mode == b"edge":
                slices = [slice(pad_begin - 1, None, -1) if a == axis else slice(None) for a in x.order.axes]
                xs.append(x[slices])

            else:
                raise NotImplementedError(f"[ONNXConverter] Unknown mode \"{mode}\"")

        xs.append(x)

        if pad_end > 0:
            if mode == b"constant":
                multiplier = AxisKeyDict(x.order.axes, [pad_end if a == axis else x.shape_dict[a] for a in x.order.axes])
                xs.append(Tile(None, multiplier)(constant_values)[0])

            elif mode == b"reflect":
                slices = [slice(-2, - 2 - pad_end, -1) if a == axis else slice(None) for a in x.order.axes]
                xs.append(x[slices])

            elif mode == b"edge":
                slices = [slice(-1, - 1 - pad_end, -1) if a == axis else slice(None) for a in x.order.axes]
                xs.append(x[slices])

            else:
                raise NotImplementedError(f"[ONNXConverter] Unknown mode \"{mode}\"")

        if len(xs) > 1:
            x, = Concat(None, axis=axis)(*xs)

    converter.set_variable(onnx_op.output[0], x)


@ONNXConverter.register_handler("SpaceToDepth")
def _convert_space_to_depth(converter: ONNXConverter, onnx_op: INodeProto):
    x = converter.get_variable(onnx_op.input[0])
    x.order.unify(OrderNCHW)

    attrs = attribute_dict(onnx_op)
    blocksize = attrs["blocksize"].i

    y, = Space2Depth(None, blocksize)(x)

    converter.set_variable(onnx_op.output[0], y)


@ONNXConverter.register_handler("DepthToSpace")
def _convert_depth_to_space(converter: ONNXConverter, onnx_op: INodeProto):
    x = converter.get_variable(onnx_op.input[0])
    x.order.unify(OrderNCHW)

    attrs = attribute_dict(onnx_op)
    blocksize = attrs["blocksize"].i

    y, = Depth2Space(None, blocksize)(x)

    converter.set_variable(onnx_op.output[0], y)
