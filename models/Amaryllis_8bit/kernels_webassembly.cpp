
#include <stdlib.h>
#include <math.h>

float static_buffer[90331685];
float* dynamic_buffer = nullptr;

int meta_buf_0[] = {90331523,0,7592323,1,16384,162};
int meta_buf_1[] = {2654208,7592323,7674243,16384};
int meta_buf_2[] = {7674243,7575939,16384};
int meta_buf_3[] = {7575939,7674243,256,64,64,256};
int meta_buf_4[] = {7674243,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_5[] = {7297411,2670592,7510403,256,64,576};
int meta_buf_6[] = {2707456,7510403,7526787,64,64,64,256};
int meta_buf_7[] = {7526787,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_8[] = {7297411,2707520,7510403,256,64,576};
int meta_buf_9[] = {2744384,7510403,7575939,7592323,64,256,256,64,256};
int meta_buf_10[] = {7592323,7526787,256,64,64,256};
int meta_buf_11[] = {7526787,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_12[] = {7297411,2744448,7674243,256,64,576};
int meta_buf_13[] = {2781312,7674243,7690627,64,64,64,256};
int meta_buf_14[] = {7690627,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_15[] = {7297411,2781376,7641475,256,64,576};
int meta_buf_16[] = {2818240,7592323,7641475,7592323,256,64,256,64,256};
int meta_buf_17[] = {7592323,7510403,256,64,64,256};
int meta_buf_18[] = {7510403,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_19[] = {7297411,2818304,7526787,256,64,576};
int meta_buf_20[] = {2855168,7526787,7526787,64,64,64,256};
int meta_buf_21[] = {7526787,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_22[] = {7297411,2855232,7625091,256,64,576};
int meta_buf_23[] = {2892096,7592323,7625091,7592323,256,64,256,64,256};
int meta_buf_24[] = {7592323,7526787,256,64,64,256};
int meta_buf_25[] = {7526787,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_26[] = {7297411,2892160,7625091,256,64,576};
int meta_buf_27[] = {2929024,7625091,7608707,64,64,64,256};
int meta_buf_28[] = {7608707,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_29[] = {7297411,2929088,7608707,256,64,576};
int meta_buf_30[] = {2965952,7592323,7608707,7526787,256,64,256,64,256};
int meta_buf_31[] = {7526787,7543171,256,64,64,256};
int meta_buf_32[] = {7543171,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_33[] = {7297411,2966016,7641475,256,64,576};
int meta_buf_34[] = {3002880,7641475,7641475,64,64,64,256};
int meta_buf_35[] = {7641475,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_36[] = {7297411,3002944,7510403,256,64,576};
int meta_buf_37[] = {3039808,7510403,7526787,7674243,64,256,256,64,256};
int meta_buf_38[] = {7674243,7543171,256,64,64,256};
int meta_buf_39[] = {7543171,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_40[] = {7297411,3039872,7543171,256,64,576};
int meta_buf_41[] = {3076736,7543171,7641475,64,64,64,256};
int meta_buf_42[] = {7641475,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_43[] = {7297411,3076800,7641475,256,64,576};
int meta_buf_44[] = {3113664,7641475,7674243,7559555,64,256,256,64,256};
int meta_buf_45[] = {7559555,7510403,256,64,64,256};
int meta_buf_46[] = {7510403,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_47[] = {7297411,3113728,7575939,256,64,576};
int meta_buf_48[] = {3150592,7575939,7625091,64,64,64,256};
int meta_buf_49[] = {7625091,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_50[] = {7297411,3150656,7592323,256,64,576};
int meta_buf_51[] = {3187520,7559555,7592323,7559555,256,64,256,64,256};
int meta_buf_52[] = {7559555,7575939,256,64,64,256};
int meta_buf_53[] = {7575939,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_54[] = {7297411,3187584,7526787,256,64,576};
int meta_buf_55[] = {3224448,7526787,7543171,64,64,64,256};
int meta_buf_56[] = {7543171,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_57[] = {7297411,3224512,7674243,256,64,576};
int meta_buf_58[] = {3261376,7674243,7559555,7510403,64,256,256,64,256};
int meta_buf_59[] = {7510403,7641475,256,64,64,256};
int meta_buf_60[] = {7641475,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_61[] = {7297411,3261440,7575939,256,64,576};
int meta_buf_62[] = {3298304,7575939,7674243,64,64,64,256};
int meta_buf_63[] = {7674243,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_64[] = {7297411,3298368,7641475,256,64,576};
int meta_buf_65[] = {3335232,7510403,7641475,7625091,256,64,256,64,256};
int meta_buf_66[] = {7625091,7641475,256,64,64,256};
int meta_buf_67[] = {7641475,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_68[] = {7297411,3335296,7690627,256,64,576};
int meta_buf_69[] = {3372160,7690627,7674243,64,64,64,256};
int meta_buf_70[] = {7674243,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_71[] = {7297411,3372224,7674243,256,64,576};
int meta_buf_72[] = {3409088,7674243,7625091,7641475,64,256,256,64,256};
int meta_buf_73[] = {7641475,7657859,256,64,64,256};
int meta_buf_74[] = {7657859,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_75[] = {7297411,3409152,7690627,256,64,576};
int meta_buf_76[] = {3446016,7690627,7707011,64,64,64,256};
int meta_buf_77[] = {7707011,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_78[] = {7297411,3446080,7690627,256,64,576};
int meta_buf_79[] = {3482944,7641475,7690627,7641475,256,64,256,64,256};
int meta_buf_80[] = {7641475,7690627,256,64,64,256};
int meta_buf_81[] = {7690627,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_82[] = {7297411,3483008,7674243,256,64,576};
int meta_buf_83[] = {3519872,7674243,7674243,64,64,64,256};
int meta_buf_84[] = {7674243,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_85[] = {7297411,3519936,7690627,256,64,576};
int meta_buf_86[] = {3556800,7641475,7690627,7641475,256,64,256,64,256};
int meta_buf_87[] = {7641475,7739779,256,64,64,256};
int meta_buf_88[] = {7739779,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_89[] = {7297411,3556864,7707011,256,64,576};
int meta_buf_90[] = {3593728,7707011,7543171,64,64,64,256};
int meta_buf_91[] = {7543171,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_92[] = {7297411,3593792,7674243,256,64,576};
int meta_buf_93[] = {3630656,7674243,7641475,7657859,64,256,256,64,256};
int meta_buf_94[] = {7657859,7510403,256,64,64,256};
int meta_buf_95[] = {7510403,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_96[] = {7297411,3630720,7690627,256,64,576};
int meta_buf_97[] = {3667584,7690627,7674243,64,64,64,256};
int meta_buf_98[] = {7674243,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_99[] = {7297411,3667648,7510403,256,64,576};
int meta_buf_100[] = {3704512,7657859,7510403,7723395,256,64,256,64,256};
int meta_buf_101[] = {7723395,7625091,256,64,64,256};
int meta_buf_102[] = {7625091,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_103[] = {7297411,3704576,7641475,256,64,576};
int meta_buf_104[] = {3741440,7641475,7543171,64,64,64,256};
int meta_buf_105[] = {7543171,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_106[] = {7297411,3741504,7690627,256,64,576};
int meta_buf_107[] = {3778368,7723395,7690627,7723395,256,64,256,64,256};
int meta_buf_108[] = {7723395,7739779,256,64,64,256};
int meta_buf_109[] = {7739779,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_110[] = {7297411,3778432,7690627,256,64,576};
int meta_buf_111[] = {3815296,7690627,7707011,64,64,64,256};
int meta_buf_112[] = {7707011,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_113[] = {7297411,3815360,7739779,256,64,576};
int meta_buf_114[] = {3852224,7739779,7723395,7690627,64,256,64,64,256};
int meta_buf_115[] = {7690627,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_116[] = {7297411,3852288,7674243,256,64,576};
int meta_buf_117[] = {3889152,7674243,7674243,64,64,64,256};
int meta_buf_118[] = {7674243,7297411,1,64,16,16,16,16,3,3,1,1,1,1,1,1};
int meta_buf_119[] = {7297411,3889216,7444867,256,256,576};
int meta_buf_120[] = {4036672,7444867,7444867,256,256,256,256};
int meta_buf_121[] = {7444867,7510403,2,1,256,64,16,32,16,32};
int meta_buf_122[] = {4036992,4036928,7510403,7444867,64,64,64,1024};
int meta_buf_123[] = {7444867,6707587,1,64,32,32,32,32,3,3,1,1,1,1,1,1};
int meta_buf_124[] = {6707587,4037056,7297411,1024,256,576};
int meta_buf_125[] = {4184512,7297411,7297411,256,256,256,1024};
int meta_buf_126[] = {7297411,6707587,2,1,256,64,32,64,32,64};
int meta_buf_127[] = {4184832,4184768,6707587,6969731,64,64,64,4096};
int meta_buf_128[] = {6969731,4348291,1,64,64,64,64,64,3,3,1,1,1,1,1,1};
int meta_buf_129[] = {4348291,4184896,6707587,4096,256,576};
int meta_buf_130[] = {4332352,6707587,6707587,256,256,256,4096};
int meta_buf_131[] = {6707587,4348291,2,1,256,64,64,128,64,128};
int meta_buf_132[] = {4332608,4332672,4348291,89282947,64,64,64,16384};
int meta_buf_133[] = {89282947,4348291,1,64,128,128,128,128,9,9,1,1,1,1,4,4};
int meta_buf_134[] = {4348291,4332736,89282947,16384,3,5184};
int meta_buf_135[] = {4348288,89282947,7510403,3,16384,3,16384};
int* meta_buffers[] = {meta_buf_0,meta_buf_1,meta_buf_2,meta_buf_3,meta_buf_4,meta_buf_5,meta_buf_6,meta_buf_7,meta_buf_8,meta_buf_9,meta_buf_10,meta_buf_11,meta_buf_12,meta_buf_13,meta_buf_14,meta_buf_15,meta_buf_16,meta_buf_17,meta_buf_18,meta_buf_19,meta_buf_20,meta_buf_21,meta_buf_22,meta_buf_23,meta_buf_24,meta_buf_25,meta_buf_26,meta_buf_27,meta_buf_28,meta_buf_29,meta_buf_30,meta_buf_31,meta_buf_32,meta_buf_33,meta_buf_34,meta_buf_35,meta_buf_36,meta_buf_37,meta_buf_38,meta_buf_39,meta_buf_40,meta_buf_41,meta_buf_42,meta_buf_43,meta_buf_44,meta_buf_45,meta_buf_46,meta_buf_47,meta_buf_48,meta_buf_49,meta_buf_50,meta_buf_51,meta_buf_52,meta_buf_53,meta_buf_54,meta_buf_55,meta_buf_56,meta_buf_57,meta_buf_58,meta_buf_59,meta_buf_60,meta_buf_61,meta_buf_62,meta_buf_63,meta_buf_64,meta_buf_65,meta_buf_66,meta_buf_67,meta_buf_68,meta_buf_69,meta_buf_70,meta_buf_71,meta_buf_72,meta_buf_73,meta_buf_74,meta_buf_75,meta_buf_76,meta_buf_77,meta_buf_78,meta_buf_79,meta_buf_80,meta_buf_81,meta_buf_82,meta_buf_83,meta_buf_84,meta_buf_85,meta_buf_86,meta_buf_87,meta_buf_88,meta_buf_89,meta_buf_90,meta_buf_91,meta_buf_92,meta_buf_93,meta_buf_94,meta_buf_95,meta_buf_96,meta_buf_97,meta_buf_98,meta_buf_99,meta_buf_100,meta_buf_101,meta_buf_102,meta_buf_103,meta_buf_104,meta_buf_105,meta_buf_106,meta_buf_107,meta_buf_108,meta_buf_109,meta_buf_110,meta_buf_111,meta_buf_112,meta_buf_113,meta_buf_114,meta_buf_115,meta_buf_116,meta_buf_117,meta_buf_118,meta_buf_119,meta_buf_120,meta_buf_121,meta_buf_122,meta_buf_123,meta_buf_124,meta_buf_125,meta_buf_126,meta_buf_127,meta_buf_128,meta_buf_129,meta_buf_130,meta_buf_131,meta_buf_132,meta_buf_133,meta_buf_134,meta_buf_135};

extern "C" void init() {
    //static_buffer = (float*)malloc(90331685 * sizeof(float));
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


void fusedelementwise_c21affb90feb17189196e7260935bec7cddb66cbda32146bcec5dc14(const int * meta_buffer)
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
            v4[d0 + d1*v7] = v12;
        }
    }
}


void elementwiseadd_2b50fc92cd4fd19f86f0b848dcf82aad36e4cb2719773776962a15c5(const int * meta_buffer)
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
            v3[d0 + d1*v5] = v8;
        }
    }
}


void depth2space_fb4d08ab9e4cdbc9170db5af72396a76eb9781af5c65d1dd49b86fdd(const int * meta_buffer)
{
    const float *x = (static_buffer + meta_buffer[0]);
    float *y = (static_buffer + meta_buffer[1]);
    const int r = meta_buffer[2];

    const int N = meta_buffer[3];
    const int C1 = meta_buffer[4];
    const int C2 = meta_buffer[5];
    const int H1 = meta_buffer[6];
    const int H2 = meta_buffer[7];
    const int W1 = meta_buffer[8];
    const int W2 = meta_buffer[9];

    for (int gid = 0; gid < N*H2*W2*C2; gid += 1) {
        const int c2 = gid % C2;
        const int w2 = gid / C2 % W2;
        const int h2 = gid / C2 / W2 % H2;
        const int n = gid / C2 / W2 / H2;
        const int w1 = w2 / r;
        const int h1 = h2 / r;
        const int c1 = c2 + (w2 % r) * C2 + (h2 % r) * C2 * r;
        y[gid] = x[((n*H1+h1)*W1+w1)*C1+c1];
    }
}


void fusedelementwise_14fa2da6de1a835ea9d3c04583df503ea797b3eb992eb510f386351b(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    const float * v3 = (static_buffer + meta_buffer[2]);
    float * v4 = (static_buffer + meta_buffer[3]);
    const int v5 = meta_buffer[4];
    const int v6 = meta_buffer[5];
    const int D0 = meta_buffer[6];
    const int D1 = meta_buffer[7];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v7 = v1[d0];
        const float v8 = v2[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v9 = v3[d0 + d1*v5];
            float v10;
            {
                v10 = v9 * v7;
            }
            float v11;
            {
                v11 = v10 + v8;
            }
            float v12;
            {
                v12 = v11 > 0 ? v11 : 0;
            }
            v4[d0 + d1*v6] = v12;
        }
    }
}


void fusedelementwise_2a96163527a14b08c811924f90c922063ed658464e0ab43e1ba54c11(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    const float * v3 = (static_buffer + meta_buffer[2]);
    float * v4 = (static_buffer + meta_buffer[3]);
    const int v5 = meta_buffer[4];
    const int v6 = meta_buffer[5];
    const int D0 = meta_buffer[6];
    const int D1 = meta_buffer[7];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v7 = v1[d0];
        const float v8 = v2[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v9 = v3[d0 + d1*v5];
            float v10;
            {
                v10 = v9 * v8;
            }
            float v11;
            {
                v11 = v10 + v7;
            }
            float v12;
            {
                v12 = v11 > 0 ? v11 : 0;
            }
            v4[d0 + d1*v6] = v12;
        }
    }
}


void fusedelementwise_755f36aa803133808d65cebb4bdca9f54486df34e0eb6728cb7bd3d5(const int * meta_buffer)
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
                v9 = tanh(v8);
            }
            v3[d0*v5 + d1] = v9;
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
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_9);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_10);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_11);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_12);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_13);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_14);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_15);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_16);
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
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_30);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_31);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_32);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_33);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_34);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_35);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_36);
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_37);
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
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_58);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_59);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_60);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_61);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_62);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_63);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_64);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_65);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_66);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_67);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_68);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_69);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_70);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_71);
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_72);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_73);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_74);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_75);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_76);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_77);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_78);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_79);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_80);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_81);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_82);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_83);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_84);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_85);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_86);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_87);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_88);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_89);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_90);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_91);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_92);
fusedelementwise_7c7a967fde8a4d7a5b35e05efe5b6c6bfec9533ed7a8f23d959ff8cd(meta_buf_93);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_94);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_95);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_96);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_97);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_98);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_99);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_100);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_101);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_102);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_103);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_104);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_105);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_106);
fusedelementwise_e277bbe409cd60201bb9ac6e958baa53566cc8cbafe32718b91293a2(meta_buf_107);
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_108);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_109);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_110);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_111);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_112);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_113);
fusedelementwise_c21affb90feb17189196e7260935bec7cddb66cbda32146bcec5dc14(meta_buf_114);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_115);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_116);
fusedelementwise_39f491a753592bd6d9a83c6f76917012b5eb3c0ac597e095aa174319(meta_buf_117);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_118);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_119);
elementwiseadd_2b50fc92cd4fd19f86f0b848dcf82aad36e4cb2719773776962a15c5(meta_buf_120);
depth2space_fb4d08ab9e4cdbc9170db5af72396a76eb9781af5c65d1dd49b86fdd(meta_buf_121);
fusedelementwise_14fa2da6de1a835ea9d3c04583df503ea797b3eb992eb510f386351b(meta_buf_122);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_123);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_124);
elementwiseadd_2b50fc92cd4fd19f86f0b848dcf82aad36e4cb2719773776962a15c5(meta_buf_125);
depth2space_fb4d08ab9e4cdbc9170db5af72396a76eb9781af5c65d1dd49b86fdd(meta_buf_126);
fusedelementwise_14fa2da6de1a835ea9d3c04583df503ea797b3eb992eb510f386351b(meta_buf_127);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_128);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_129);
elementwiseadd_2b50fc92cd4fd19f86f0b848dcf82aad36e4cb2719773776962a15c5(meta_buf_130);
depth2space_fb4d08ab9e4cdbc9170db5af72396a76eb9781af5c65d1dd49b86fdd(meta_buf_131);
fusedelementwise_2a96163527a14b08c811924f90c922063ed658464e0ab43e1ba54c11(meta_buf_132);
im2col_1dc147a294d043a7b2199b007777978656dfb88774a7a9bb20a1039c(meta_buf_133);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_134);
fusedelementwise_755f36aa803133808d65cebb4bdca9f54486df34e0eb6728cb7bd3d5(meta_buf_135);

}

