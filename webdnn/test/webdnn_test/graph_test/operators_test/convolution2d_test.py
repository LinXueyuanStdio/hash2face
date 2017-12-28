from webdnn.graph.axis import Axis, AxisKeyDict
from webdnn.graph.operators.convolution2d import Convolution2D
from webdnn.graph.order import Order
from webdnn.graph.variable import Variable


def main(k, s, p, n, h1, w1, c1, c2, expected_shape_dict: AxisKeyDict[int]):
    op = Convolution2D(None, ksize=k, stride=s, padding=p)

    x = Variable((n, h1, w1, c1), Order([Axis.N, Axis.H, Axis.W, Axis.C]))
    w = Variable((c1, op.ksize[0], op.ksize[1], c2), Order([Axis.C, Axis.KH, Axis.KW, Axis.N]))

    y, = op(x, w)

    for axis in y.order.axes:
        assert y.shape_dict[axis] == expected_shape_dict[axis]


def test_normal():
    main(3, 1, 1, 2, 3, 4, 5, 6, AxisKeyDict([Axis.N, Axis.H, Axis.W, Axis.C], [2, 3, 4, 6]))


def test_large_stride():
    main(3, 2, 1, 2, 5, 7, 3, 6, AxisKeyDict([Axis.N, Axis.H, Axis.W, Axis.C], [2, 3, 4, 6]))


def test_no_padding():
    main(3, 1, 0, 2, 5, 7, 3, 6, AxisKeyDict([Axis.N, Axis.H, Axis.W, Axis.C], [2, 3, 5, 6]))


def test_projection():
    main(1, 1, 0, 2, 5, 7, 3, 6, AxisKeyDict([Axis.N, Axis.H, Axis.W, Axis.C], [2, 5, 7, 6]))


def test_fully_connected():
    main((5, 7), 1, 0, 2, 5, 7, 3, 6, AxisKeyDict([Axis.N, Axis.H, Axis.W, Axis.C], [2, 1, 1, 6]))
