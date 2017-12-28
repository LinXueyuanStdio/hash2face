import numpy as np

from test.util import generate_kernel_test_case, wrap_template
from webdnn.graph.graph import Graph
from webdnn.graph.operators.tanh import Tanh
from webdnn.graph.order import OrderNHWC, OrderNCHW
from webdnn.graph.variable import Variable


@wrap_template
def template(r=1.0, x_order=OrderNHWC, y_order=OrderNHWC, description: str = ""):
    vx = (np.random.rand(2, 3, 4, 5) - 0.5) * r
    vy = np.tanh(vx)

    x = Variable(vx.shape, order=OrderNHWC)
    y, = Tanh(None)(x)

    x.change_order(x_order)
    y.change_order(y_order)

    generate_kernel_test_case(
        description=f"Tanh {description}",
        graph=Graph([x], [y]),
        inputs={x: np.transpose(vx.data, [OrderNHWC.axes_dict[a] for a in x.order.axes])},
        expected={y: np.transpose(vy.data, [OrderNHWC.axes_dict[a] for a in y.order.axes])},
        EPS=1e-2
    )


def test():
    template()


def test_different_order():
    template(x_order=OrderNCHW)


def test_large_range():
    template(r=1e3)
