from typing import Optional

from webdnn.graph.graph import Graph
from webdnn.graph.operators.attributes.associative import Associative
from webdnn.graph.operators.attributes.commutative import Commutative
from webdnn.graph.operators.elementwise import Elementwise
from webdnn.graph.optimize_rule import OptimizeRule
from webdnn.graph.variables.constant_variable import ConstantVariable


class ElementwiseMul(Elementwise):
    """ElementwiseMul(name)

    Elementwise multiply

    Args:
        name (str): Operator name.

    Signature
        .. code::

            y, = op(x0, x1)

        - **x0**, **x1** - Input variable. They must be same shape.
        - **y** - Output variable. Its order and shape is same as :code:`x0`.

        This operator also can be called by :code:`*`.

        .. code::

            y = x0 * x1
    """

    def __init__(self, name: Optional[str]):
        super(ElementwiseMul, self).__init__(name)
        self.attributes.add(Commutative(self, ('x0', 'x1')))
        self.attributes.add(Associative(self, ('x0', 'x1')))

    def fold_constance(self, graph: Graph):
        x0 = self.inputs["x0"]  # type: ConstantVariable
        x1 = self.inputs["x1"]  # type: ConstantVariable
        y = self.outputs["y"]
        self.remove_all()

        new_y = ConstantVariable(x0.copy().change_order(y.order).data * x1.copy().change_order(y.order).data, y.order)
        OptimizeRule.replace_variable(graph, y, new_y)
