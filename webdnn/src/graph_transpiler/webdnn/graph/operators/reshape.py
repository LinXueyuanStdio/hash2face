from typing import Optional, Union, Sequence

from webdnn.graph.graph import Graph
from webdnn.graph.operator import Operator
from webdnn.graph.operators.attributes.inplace import InplaceOperator
from webdnn.graph.optimize_rule import OptimizeRule
from webdnn.graph.order import Order
from webdnn.graph.placeholder import Placeholder
from webdnn.graph.variable import Variable
from webdnn.graph.variables.constant_variable import ConstantVariable
from webdnn.util.misc import mul


class Reshape(Operator):
    """Reshape(name, in_order, out_order, out_shape)

    Reshape array assuming it is C-order.
    Removing / inserting axis with length 1

    When in_order: NHWC, out_order: NTC, out_shape: (2, 6, 10) and input variable is (2, 3, 4, 5), the semantic procedure is as follows.
    1. Interpret input variable as NTHWC (2, 1, 3, 4, 5) with inserting axis with length 1
    2. Reshape it with assuming C-order and length of axis being removed is 1; NTHWC (2, 6, 1, 1, 10)
    3. Remove axes; NTC (2, 6, 10)

    Swapping axes is prohibited because it is ambiguous.
    If in_order and out_order match the actual input / output variable order, kernel does not have to do anything.

    Args:
        name (str): Operator name.
        in_order (:class:`~webdnn.graph.order.Order`): input order
        out_order (:class:`~webdnn.graph.order.Order`): output order
        out_shape (list of int or :class:`~webdnn.graph.placeholder.Placeholder`): output shape

    Signature
        .. code::

            y, = op(x)

        - **x** - Input variable.
        - **y** - Output variable.
    """

    def __init__(self, name: Optional[str], in_order: Order, out_order: Order, out_shape: Sequence[Union[int, Placeholder]]):
        super().__init__(name)

        assert -1 not in out_shape, "-1 (wildcard) in reshape output shape is currently not supported"

        for i, v in enumerate(out_shape):
            if not isinstance(v, (Placeholder, int)):
                raise TypeError(f"""
[Reshape] Parameter "out_shape" must be sequence of integer
    (value) = {v}
    (type of value[{i}]) = {type(v)}""")

        self.parameters["in_order"] = in_order
        self.parameters["out_order"] = out_order
        self.parameters["out_shape"] = out_shape

        self.attributes.add(InplaceOperator(self, "x", "y"))

    def __call__(self, x: Variable):
        self.append_input("x", x)
        return self.exec()

    def exec(self):
        x = self.inputs["x"]

        in_shape = x.shape
        in_order = self.parameters["in_order"]
        out_shape = self.parameters["out_shape"]
        out_order = self.parameters["out_order"]
        assert x.size == mul(out_shape), f"""
[Reshape] Variable size must not be changed:
    (input shape)={in_shape}
    (input size)={mul(in_shape)}
    (output shape)={out_shape}
    (output size)={mul(out_shape)}"""

        y = Variable(out_shape, out_order)
        self.append_output("y", y)

        return y,

    def fold_constance(self, graph: Graph):
        in_order = self.parameters["in_order"]
        out_shape = self.parameters["out_shape"]
        out_order = self.parameters["out_order"]

        x = self.inputs["x"]  # type: ConstantVariable
        y = self.outputs["y"]
        self.remove_all()

        new_y = ConstantVariable(x.copy().change_order(in_order).data.reshape(out_shape), out_order)
        OptimizeRule.replace_variable(graph, y, new_y)
