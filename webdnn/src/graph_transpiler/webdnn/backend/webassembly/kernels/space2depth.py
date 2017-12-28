from typing import List

from webdnn.backend.code_generator.allocator import MemoryLayout
from webdnn.backend.code_generator.injectors.buffer_injector import BufferInjector
from webdnn.backend.code_generator.injectors.kernel_name_injector import KernelNameInjector
from webdnn.backend.webassembly.generator import WebassemblyDescriptorGenerator
from webdnn.backend.webassembly.kernel import Kernel
from webdnn.graph.axis import Axis
from webdnn.graph.operators.space2depth import Space2Depth
from webdnn.graph.order import OrderNHWC

template = """
void %%FUNC_NAME%%(const int * %%META_BUFFER%%)
{
    const float *x = %%LOAD_BUFFER(space2depth_x)%%;
    float *y = %%LOAD_BUFFER(space2depth_y)%%;
    const int r = %%LOAD_BUFFER(space2depth_r)%%;

    const int N = %%LOAD_BUFFER(space2depth_N)%%;
    const int C1 = %%LOAD_BUFFER(space2depth_C1)%%;
    const int C2 = %%LOAD_BUFFER(space2depth_C2)%%;
    const int H1 = %%LOAD_BUFFER(space2depth_H1)%%;
    const int H2 = %%LOAD_BUFFER(space2depth_H2)%%;
    const int W1 = %%LOAD_BUFFER(space2depth_W1)%%;
    const int W2 = %%LOAD_BUFFER(space2depth_W2)%%;

    for (int gid = 0; gid < N*H1*W1*C1; gid += 1) {
        const int c1 = gid % C1;
        const int w1 = gid / C1 % W1;
        const int h1 = gid / C1 / W1 % H1;
        const int n = gid / C1 / W1 / H1;
        const int w2 = w1 / r;
        const int h2 = h1 / r;
        const int c2 = c1 + (w1 % r) * C1 + (h1 % r) * C1 * r;
        y[((n*H2+h2)*W2+w2)*C2+c2] = x[gid];
    }
}
"""


@WebassemblyDescriptorGenerator.register_handler(Space2Depth)
def space2depth(op: Space2Depth, memory_layout: MemoryLayout) -> List[Kernel]:
    x = op.inputs["x"]
    y = op.outputs["y"]
    r = op.parameters['r']

    assert x.order == OrderNHWC
    assert y.order == OrderNHWC

    buffer_injector = BufferInjector()
    buffer_injector.register({
        "space2depth_x": memory_layout[x],
        "space2depth_y": memory_layout[y],
        'space2depth_r': r,
        "space2depth_N": x.shape_dict[Axis.N],
        "space2depth_C1": x.shape_dict[Axis.C],
        "space2depth_C2": y.shape_dict[Axis.C],
        "space2depth_H1": x.shape_dict[Axis.H],
        "space2depth_H2": y.shape_dict[Axis.H],
        "space2depth_W1": x.shape_dict[Axis.W],
        "space2depth_W2": y.shape_dict[Axis.W],
    })

    name_injector = KernelNameInjector(op)

    source = template
    source = buffer_injector.inject(source)
    source = name_injector.inject(source)

    kernel = Kernel(
        {name_injector.name: source},
        name_injector.name,
        buffer_injector.buffer,
        buffer_injector.unresolved_value_list
    )

    return [kernel]
