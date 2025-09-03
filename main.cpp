#include <iostream>
#include <boost/math/distributions/beta.hpp>

auto epsilon = 1e-10;

extern "C"
{
    double betaPDF(double x, double distAlpha, double distBeta)
    {
        auto dist = boost::math::beta_distribution<>(distAlpha, distBeta);
        return boost::math::pdf(dist, x);
    }

    double betaPPF(double x, double distAlpha, double distBeta)
    {
        auto dist = boost::math::beta_distribution<>(distAlpha, distBeta);
        return boost::math::quantile(dist, x);
    }
    double betaPDFAtMode(double distAlpha, double distBeta)
    {
        // Handle the uniform distribution case
        if (distAlpha == 1 && distBeta == 1)
            return 1.0;

        if (distAlpha == 1 && distBeta > 1)
            return distBeta; // PDF at 0
        if (distBeta == 1 && distAlpha > 1)
            return distAlpha; // PDF at 1

        // Ensure alpha and beta are greater than 1 to have a well-defined mode
        if (distAlpha <= 1 || distBeta <= 1)
            throw std::invalid_argument("Alpha and Beta must be greater than 1 to have a mode.");
        double mode = (distAlpha - 1) / (distAlpha + distBeta - 2);
        double pdf_value = betaPDF(mode, distAlpha, distBeta);

        return pdf_value;
    }
}

void testBetaPDF()
{
    auto val1 = betaPDF(0.4, 2.0, 3.0);
    auto expected1 = 1.7280000000000006;
    assert(abs(val1 - expected1) < epsilon);
    auto val2 = betaPDF(0.888, 3, 37);
    auto expected2 = 1.2784821820520697e-30;
    assert(abs(val2 - expected2) < epsilon);
    auto val3 = betaPDF(0.888, 37, 3);
    auto expected3 = 4.778842808521972;
    assert(abs(val3 - expected3) < epsilon);
    auto val4 = betaPDF(0.5, 147, 200);
    auto expected4 = 0.25230627071202744;
    assert(abs(val4 - expected4) < epsilon);
}

void testBetaPPF()
{
    auto val1 = betaPPF(0.888, 37.0, 3.0);
    auto expected1 = 0.9699208011705024;
    assert(abs(val1 - expected1) < epsilon);
    auto val2 = betaPPF(0.000009, 5, 5);
    auto expected2 = 0.03819410766837529;
    assert(abs(val2 - expected2) < epsilon);
    auto val3 = betaPPF(0.999991, 50, 5);
    auto expected3 = 0.9948834927314849;
    assert(abs(val3 - expected3) < epsilon);
}

int main()
{
    testBetaPDF();
    testBetaPPF();

    std::cout<<"All tests passed successfully."<<std::endl;

    return 0;
}
