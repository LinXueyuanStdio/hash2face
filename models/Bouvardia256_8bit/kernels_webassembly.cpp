
#include <stdlib.h>
#include <math.h>

float static_buffer[57800487];
float* dynamic_buffer = nullptr;

int meta_buf_0[] = {57800323,0,22869635,1,65536,164};
int meta_buf_1[] = {10747904,22869635,22869635,65536};
int meta_buf_2[] = {22869635,22804099,65536};
int meta_buf_3[] = {22804099,23000707,1024,64,64,1024};
int meta_buf_4[] = {23000707,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_5[] = {22148739,10813440,23000707,1024,64,576};
int meta_buf_6[] = {10850304,23000707,22935171,64,64,64,1024};
int meta_buf_7[] = {22935171,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_8[] = {22148739,10850368,22869635,1024,64,576};
int meta_buf_9[] = {10887232,22804099,22869635,22804099,1024,64,1024,64,1024};
int meta_buf_10[] = {22804099,22935171,1024,64,64,1024};
int meta_buf_11[] = {22935171,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_12[] = {22148739,10887296,22869635,1024,64,576};
int meta_buf_13[] = {10924160,22869635,22738563,64,64,64,1024};
int meta_buf_14[] = {22738563,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_15[] = {22148739,10924224,23066243,1024,64,576};
int meta_buf_16[] = {10961088,23066243,22804099,22935171,64,1024,1024,64,1024};
int meta_buf_17[] = {22935171,22869635,1024,64,64,1024};
int meta_buf_18[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_19[] = {22148739,10961152,23000707,1024,64,576};
int meta_buf_20[] = {10998016,23000707,22869635,64,64,64,1024};
int meta_buf_21[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_22[] = {22148739,10998080,23000707,1024,64,576};
int meta_buf_23[] = {11034944,22935171,23000707,22738563,1024,64,1024,64,1024};
int meta_buf_24[] = {22738563,22935171,1024,64,64,1024};
int meta_buf_25[] = {22935171,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_26[] = {22148739,11035008,22869635,1024,64,576};
int meta_buf_27[] = {11071872,22869635,22869635,64,64,64,1024};
int meta_buf_28[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_29[] = {22148739,11071936,23066243,1024,64,576};
int meta_buf_30[] = {11108800,23066243,22738563,23000707,64,1024,1024,64,1024};
int meta_buf_31[] = {23000707,22869635,1024,64,64,1024};
int meta_buf_32[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_33[] = {22148739,11108864,22738563,1024,64,576};
int meta_buf_34[] = {11145728,22738563,22738563,64,64,64,1024};
int meta_buf_35[] = {22738563,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_36[] = {22148739,11145792,22935171,1024,64,576};
int meta_buf_37[] = {11182656,23000707,22935171,23000707,1024,64,1024,64,1024};
int meta_buf_38[] = {23000707,22869635,1024,64,64,1024};
int meta_buf_39[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_40[] = {22148739,11182720,22738563,1024,64,576};
int meta_buf_41[] = {11219584,22738563,22935171,64,64,64,1024};
int meta_buf_42[] = {22935171,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_43[] = {22148739,11219648,22869635,1024,64,576};
int meta_buf_44[] = {11256512,22869635,23000707,22804099,64,1024,1024,64,1024};
int meta_buf_45[] = {22804099,22738563,1024,64,64,1024};
int meta_buf_46[] = {22738563,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_47[] = {22148739,11256576,22869635,1024,64,576};
int meta_buf_48[] = {11293440,22869635,22869635,64,64,64,1024};
int meta_buf_49[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_50[] = {22148739,11293504,23000707,1024,64,576};
int meta_buf_51[] = {11330368,22804099,23000707,22804099,1024,64,1024,64,1024};
int meta_buf_52[] = {22804099,22869635,1024,64,64,1024};
int meta_buf_53[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_54[] = {22148739,11330432,22869635,1024,64,576};
int meta_buf_55[] = {11367296,22869635,22869635,64,64,64,1024};
int meta_buf_56[] = {22869635,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_57[] = {22148739,11367360,22869635,1024,64,576};
int meta_buf_58[] = {11404224,22804099,22869635,22738563,1024,64,64,64,1024};
int meta_buf_59[] = {22738563,22148739,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_60[] = {22148739,11404288,22869635,1024,64,576};
int meta_buf_61[] = {11441152,22869635,22935171,64,64,64,1024};
int meta_buf_62[] = {22935171,22410883,1,32,32,64,64,64,2,2,2,2,0,0};
int meta_buf_63[] = {22410883,11662979,1,64,64,64,64,64,3,3,1,1,1,1,1,1};
int meta_buf_64[] = {11662979,11441216,22410883,4096,64,576};
int meta_buf_65[] = {11478080,22410883,22410883,64,64,64,4096};
int meta_buf_66[] = {22410883,11662979,1,64,64,64,64,64,3,3,1,1,1,1,1,1};
int meta_buf_67[] = {11662979,11478144,22410883,4096,64,576};
int meta_buf_68[] = {11515008,22410883,22148739,64,64,64,4096};
int meta_buf_69[] = {22148739,21100163,1,64,64,64,128,128,2,2,2,2,0,0};
int meta_buf_70[] = {21100163,11662979,1,64,128,128,128,128,3,3,1,1,1,1,1,1};
int meta_buf_71[] = {11662979,11515072,21100163,16384,64,576};
int meta_buf_72[] = {11551936,21100163,22148739,64,64,64,16384};
int meta_buf_73[] = {22148739,11662979,1,64,128,128,128,128,3,3,1,1,1,1,1,1};
int meta_buf_74[] = {11662979,11552000,22148739,16384,64,576};
int meta_buf_75[] = {11588864,22148739,21100163,64,64,64,16384};
int meta_buf_76[] = {21100163,49411715,1,128,128,64,256,256,2,2,2,2,0,0};
int meta_buf_77[] = {49411715,11662979,1,64,256,256,256,256,3,3,1,1,1,1,1,1};
int meta_buf_78[] = {11662979,11588928,49411715,65536,64,576};
int meta_buf_79[] = {11625792,49411715,53606019,64,64,64,65536};
int meta_buf_80[] = {53606019,11662979,1,64,256,256,256,256,3,3,1,1,1,1,1,1};
int meta_buf_81[] = {11662979,11625856,49411715,65536,64,576};
int meta_buf_82[] = {11662720,49411715,11662979,64,64,64,65536};
int meta_buf_83[] = {11662979,11662784,22607491,65536,3,64};
int meta_buf_84[] = {11662976,22607491,22410883,3,65536,3,65536};
int* meta_buffers[] = {meta_buf_0,meta_buf_1,meta_buf_2,meta_buf_3,meta_buf_4,meta_buf_5,meta_buf_6,meta_buf_7,meta_buf_8,meta_buf_9,meta_buf_10,meta_buf_11,meta_buf_12,meta_buf_13,meta_buf_14,meta_buf_15,meta_buf_16,meta_buf_17,meta_buf_18,meta_buf_19,meta_buf_20,meta_buf_21,meta_buf_22,meta_buf_23,meta_buf_24,meta_buf_25,meta_buf_26,meta_buf_27,meta_buf_28,meta_buf_29,meta_buf_30,meta_buf_31,meta_buf_32,meta_buf_33,meta_buf_34,meta_buf_35,meta_buf_36,meta_buf_37,meta_buf_38,meta_buf_39,meta_buf_40,meta_buf_41,meta_buf_42,meta_buf_43,meta_buf_44,meta_buf_45,meta_buf_46,meta_buf_47,meta_buf_48,meta_buf_49,meta_buf_50,meta_buf_51,meta_buf_52,meta_buf_53,meta_buf_54,meta_buf_55,meta_buf_56,meta_buf_57,meta_buf_58,meta_buf_59,meta_buf_60,meta_buf_61,meta_buf_62,meta_buf_63,meta_buf_64,meta_buf_65,meta_buf_66,meta_buf_67,meta_buf_68,meta_buf_69,meta_buf_70,meta_buf_71,meta_buf_72,meta_buf_73,meta_buf_74,meta_buf_75,meta_buf_76,meta_buf_77,meta_buf_78,meta_buf_79,meta_buf_80,meta_buf_81,meta_buf_82,meta_buf_83,meta_buf_84};

extern "C" void init() {
    //static_buffer = (float*)malloc(57800487 * sizeof(float));
}

extern "C" float* get_static_buffer(void) {
    return static_buffer;
}

extern "C" float* allocate_dynamic_buffer(int count) {
    if (dynamic_buffer) {
        free(dynamic_buffer);
        dynamic_buffer = nullptr;
    }
    dynamic_buffer = (float*)malloc(count * sizeof(float));
    return dynamic_buffer;
}

extern "C" float* get_dynamic_buffer(void) {
    return dynamic_buffer;
}
extern "C" void set_placeholder_value(int kernel_order, int offset, int value) {
    meta_buffers[kernel_order][offset] = value;
}

#ifndef INCLUDE_EIGEN
#define INCLUDE_EIGEN
#include <Eigen/Dense>
#endif

void tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(const int * meta_buffer)
{
    float *A = (static_buffer + meta_buffer[0]);
    float *B = (static_buffer + meta_buffer[1]);
    float *C = (static_buffer + meta_buffer[2]);

    Eigen::Map<Eigen::Matrix<float, Eigen::Dynamic, Eigen::Dynamic, Eigen::RowMajor> > a_mat(A, meta_buffer[3], meta_buffer[5]);
    Eigen::Map<Eigen::Matrix<float, Eigen::Dynamic, Eigen::Dynamic, Eigen::ColMajor> > b_mat(B, meta_buffer[5], meta_buffer[4]);
    Eigen::Map<Eigen::Matrix<float, Eigen::Dynamic, Eigen::Dynamic, Eigen::RowMajor> > c_mat(C, meta_buffer[3], meta_buffer[4]);

    c_mat.noalias() = a_mat * b_mat;
}


void fusedelementwise_9d5b58d4f5a00a595e84c1773b477ca77b891512fffc1c7d24d35e3d(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    float * v3 = (static_buffer + meta_buffer[2]);
    const int D0 = meta_buffer[3];
    int d0;
    for (d0 = 0; d0 < D0; d0 += 1) {
        const float v4 = v1[d0];
        const float v5 = v2[d0];
        float v6;
        {
            v6 = v5 + v4;
        }
        float v7;
        {
            v7 = v6 > 0 ? v6 : 0;
        }
        v3[d0] = v7;
    }
}


void reshape_f6c88dc1fd9479f62d789912530e6a5c7c51c73de368540e8b8e1ceb(const int * meta_buffer )
{
    const float *x = (static_buffer + meta_buffer[0]);
    float *y = (static_buffer + meta_buffer[1]);

    const int N = meta_buffer[2];

    for (int gid = 0; gid < N; gid += 1) {
        y[gid] = x[gid];
    }
}


void transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    float * v2 = (static_buffer + meta_buffer[1]);
    const int v3 = meta_buffer[2];
    const int v4 = meta_buffer[3];
    const int D0 = meta_buffer[4];
    const int D1 = meta_buffer[5];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v5 = v1[d0*v3 + d1];
            float v6;
            {
                v6 = v5;
            }
            v2[d0 + d1*v4] = v6;
        }
    }
}


void im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(const int * meta_buffer)
{
    const float *im = (static_buffer + meta_buffer[0]);
    float *col = (static_buffer + meta_buffer[1]);

    const int N = meta_buffer[2];
    const int C1 = meta_buffer[3];
    const int H1 = meta_buffer[4];
    const int W1 = meta_buffer[5];
    const int H2 = meta_buffer[6];
    const int W2 = meta_buffer[7];
    const int KH = meta_buffer[8];
    const int KW = meta_buffer[9];
    const int DH = meta_buffer[10];
    const int DW = meta_buffer[11];
    const int SH = meta_buffer[12];
    const int SW = meta_buffer[13];
    const int PH = meta_buffer[14];
    const int PW = meta_buffer[15];

    for (int gid = 0; gid < N*H2*W2*KH*KW*C1; gid += 1) {
        const int c1 = gid % C1;
        const int kw = gid / C1 % KW;
        const int kh = gid / C1 / KW % KH;
        const int w2 = gid / C1 / KW / KH % W2;
        const int h2 = gid / C1 / KW / KH / W2 % H2;
        const int  n = gid / C1 / KW / KH / W2 / H2;
        
        const int h1 = h2 * SH - PH + kh * DH;
        const int w1 = w2 * SW - PW + kw * DW;

        col[gid] = (h1 < 0 || h1 >= H1 || w1 < 0 || w1 >= W1) ? 0 : im[((n*H1+h1)*W1+w1)*C1+c1];
    }
}


void fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    float * v3 = (static_buffer + meta_buffer[2]);
    const int v4 = meta_buffer[3];
    const int v5 = meta_buffer[4];
    const int D0 = meta_buffer[5];
    const int D1 = meta_buffer[6];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v6 = v1[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v7 = v2[d0 + d1*v4];
            float v8;
            {
                v8 = v7 + v6;
            }
            float v9;
            {
                v9 = v8 > 0 ? v8 : 0;
            }
            v3[d0 + d1*v5] = v9;
        }
    }
}


void fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    const float * v3 = (static_buffer + meta_buffer[2]);
    float * v4 = (static_buffer + meta_buffer[3]);
    const int v5 = meta_buffer[4];
    const int v6 = meta_buffer[5];
    const int v7 = meta_buffer[6];
    const int D0 = meta_buffer[7];
    const int D1 = meta_buffer[8];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v8 = v1[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v9 = v2[d0*v5 + d1];
            const float v10 = v3[d0 + d1*v6];
            float v11;
            {
                v11 = v10 + v9;
            }
            float v12;
            {
                v12 = v8 + v11;
            }
            v4[d0*v7 + d1] = v12;
        }
    }
}


void fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    const float * v3 = (static_buffer + meta_buffer[2]);
    float * v4 = (static_buffer + meta_buffer[3]);
    const int v5 = meta_buffer[4];
    const int v6 = meta_buffer[5];
    const int v7 = meta_buffer[6];
    const int D0 = meta_buffer[7];
    const int D1 = meta_buffer[8];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v8 = v1[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v9 = v2[d0 + d1*v5];
            const float v10 = v3[d0*v6 + d1];
            float v11;
            {
                v11 = v9 + v10;
            }
            float v12;
            {
                v12 = v8 + v11;
            }
            v4[d0*v7 + d1] = v12;
        }
    }
}


void fusedelementwise_4bb46c1ecf24503baf4c5281daa8fdf6b67e788c7d3bdb7b90b3d30b(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    const float * v3 = (static_buffer + meta_buffer[2]);
    float * v4 = (static_buffer + meta_buffer[3]);
    const int v5 = meta_buffer[4];
    const int v6 = meta_buffer[5];
    const int v7 = meta_buffer[6];
    const int D0 = meta_buffer[7];
    const int D1 = meta_buffer[8];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v8 = v1[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v9 = v2[d0*v5 + d1];
            const float v10 = v3[d0 + d1*v6];
            float v11;
            {
                v11 = v10 + v9;
            }
            float v12;
            {
                v12 = v8 + v11;
            }
            v4[d0 + d1*v7] = v12;
        }
    }
}


void unpooling2d_7ab39179ab820eb2476f7a86b7963ff313ca52336b01bc45cbe4a952(const int * meta_buffer)
{
    const float *X = (static_buffer + meta_buffer[0]);
    float *Y = (static_buffer + meta_buffer[1]);
    const int N = meta_buffer[2];
    const int H1 = meta_buffer[3];
    const int W1 = meta_buffer[4];
    const int C = meta_buffer[5];
    const int H2 = meta_buffer[6];
    const int W2 = meta_buffer[7];

    const int KH = meta_buffer[8];
    const int KW = meta_buffer[9];
    const int SH = meta_buffer[10];
    const int SW = meta_buffer[11];
    const int PH = meta_buffer[12];
    const int PW = meta_buffer[13];

    for (int gid = 0; gid < N * H2 * W2 * C; gid += 1) {
        const int c = gid % C;
        const int w2 = gid / C % W2;
        const int h2 = gid / C / W2 % H2;
        const int n = gid / C / W2 / H2;

        float v = 0;
        for (int kh = 0; kh < KH; kh++) {
            int h1 = h2 + PH - kh;
            if (h1 < 0 || h1 >= H1 * SH) continue;
            if (h1 % SH != 0) continue;
            h1 /= SH;
            for (int kw = 0; kw < KW; kw++) {
                int w1 = w2 + PW - kw;
                if (w1 < 0 || w1 >= W1 * SW) continue;
                if (w1 % SW != 0) continue;
                w1 /= SW;
                v += X[((n * H1 + h1) * W1 + w1) * C + c];
            }
        }

        Y[gid] = v;
    }
}


void elementwiseadd_a7a1bac0d1004f08225f89ef90716997e916fb65d62d759a6fac66b7(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    float * v3 = (static_buffer + meta_buffer[2]);
    const int v4 = meta_buffer[3];
    const int v5 = meta_buffer[4];
    const int D0 = meta_buffer[5];
    const int D1 = meta_buffer[6];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v6 = v1[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v7 = v2[d0 + d1*v4];
            float v8;
            {
                v8 = v7 + v6;
            }
            v3[d0*v5 + d1] = v8;
        }
    }
}

extern "C" void run() {
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_0);
fusedelementwise_9d5b58d4f5a00a595e84c1773b477ca77b891512fffc1c7d24d35e3d(meta_buf_1);
reshape_f6c88dc1fd9479f62d789912530e6a5c7c51c73de368540e8b8e1ceb(meta_buf_2);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_3);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_4);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_5);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_6);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_7);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_8);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_9);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_10);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_11);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_12);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_13);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_14);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_15);
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_16);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_17);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_18);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_19);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_20);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_21);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_22);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_23);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_24);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_25);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_26);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_27);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_28);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_29);
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_30);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_31);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_32);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_33);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_34);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_35);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_36);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_37);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_38);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_39);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_40);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_41);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_42);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_43);
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_44);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_45);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_46);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_47);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_48);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_49);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_50);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_51);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_52);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_53);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_54);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_55);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_56);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_57);
fusedelementwise_4bb46c1ecf24503baf4c5281daa8fdf6b67e788c7d3bdb7b90b3d30b(meta_buf_58);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_59);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_60);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_61);
unpooling2d_7ab39179ab820eb2476f7a86b7963ff313ca52336b01bc45cbe4a952(meta_buf_62);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_63);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_64);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_65);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_66);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_67);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_68);
unpooling2d_7ab39179ab820eb2476f7a86b7963ff313ca52336b01bc45cbe4a952(meta_buf_69);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_70);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_71);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_72);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_73);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_74);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_75);
unpooling2d_7ab39179ab820eb2476f7a86b7963ff313ca52336b01bc45cbe4a952(meta_buf_76);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_77);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_78);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_79);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_80);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_81);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_82);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_83);
elementwiseadd_a7a1bac0d1004f08225f89ef90716997e916fb65d62d759a6fac66b7(meta_buf_84);

}

