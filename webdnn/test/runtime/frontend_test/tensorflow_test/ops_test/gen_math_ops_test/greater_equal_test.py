import numpy as np

from test.runtime.frontend_test.tensorflow_test.util import TensorFlowConverter, tf
from test.util import generate_kernel_test_case, wrap_template


@wrap_template
def template(x0_shape, x1_shape, description: str = ""):
    x0 = tf.placeholder(np.float32, x0_shape, "x0")
    x1 = tf.placeholder(np.float32, x1_shape, "x1")
    y = x0 >= x1

    vx0 = np.random.rand(*x0_shape).astype(np.float32)
    vx1 = np.random.rand(*x1_shape).astype(np.float32)
    with tf.Session() as sess:
        vy, = sess.run([y], {x0: vx0, x1: vx1})

        graph = TensorFlowConverter(sess, batch_size=2).convert([x0, x1], [y])

    generate_kernel_test_case(
        description=f"[TensorFlow] GreaterEqual {description}",
        graph=graph,
        backend=["webgpu", "webassembly", "webgl"],
        inputs={
            graph.inputs[0]: vx0,
            graph.inputs[1]: vx1
        },
        expected={graph.outputs[0]: np.float32(vy)},
    )


def test():
    template(x0_shape=[2, 3, 4, 5], x1_shape=[2, 3, 4, 5])


def test_broadcast1():
    template(x0_shape=[2, 3, 4, 5], x1_shape=[5])


def test_broadcast2():
    template(x0_shape=[2, 3, 4, 5], x1_shape=[1, 5])


def test_broadcast3():
    template(x0_shape=[2, 3, 4, 5], x1_shape=[1, 1, 1, 5])


def test_broadcast4():
    template(x0_shape=[2, 1, 4, 1], x1_shape=[1, 3, 1, 5])


def test_broadcast5():
    template(x0_shape=[1, 1, 4, 1], x1_shape=[1, 1, 1, 5])
