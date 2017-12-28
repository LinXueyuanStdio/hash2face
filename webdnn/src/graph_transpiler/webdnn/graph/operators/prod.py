import numpy as np

from webdnn.graph.graph import Graph
from webdnn.graph.operators.reduce import Reduce
from webdnn.graph.optimize_rule import OptimizeRule
from webdnn.graph.order import Order
from webdnn.graph.variables.constant_variable import ConstantVariable


class Prod(Reduce):
    """Prod(name, axis)

    return product of the input tensor along to specified axis

    Args:
        name (str): Operator name.
        axis (:obj:`~webdnn.Axis`) axis which will be reduced.

    Signature
        .. code::

            y, = op(x)

        - **x** - Input variables.
        - **y** - Output variable.
    """

    def fold_constance(self, graph: Graph):
        x = self.inputs["x"]  # type: ConstantVariable
        y = self.outputs["y"]

        new_axes = list(x.order.axes)
        new_axes.remove(self.axis)
        new_y = ConstantVariable(np.prod(x.data, axis=x.order.axes_dict[self.axis]), Order(new_axes))

        new_y.change_order(y.order)

        OptimizeRule.replace_variable(graph, y, new_y)
        self.remove_all()
