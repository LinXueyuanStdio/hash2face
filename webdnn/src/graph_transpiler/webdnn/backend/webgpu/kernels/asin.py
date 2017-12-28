from webdnn.backend.webgpu.kernels.elementwise import register_elementwise_kernel
from webdnn.graph.operators.asin import Asin
from webdnn.graph.operators.sin import Sin

register_elementwise_kernel(Asin, "y = asin(x0);")
