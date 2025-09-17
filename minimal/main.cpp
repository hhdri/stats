#include <boost/math/distributions/beta.hpp>

extern "C" {
    void betaPercentileDensities(double a, double b, double* xs, double* ys) {
        boost::math::beta_distribution<double> dist(a, b);
        for (int i = 0; i <= 100; ++i) xs[i] = boost::math::quantile(dist, i / 100.0);
        for (int i = 0; i <= 100; ++i) ys[i] = boost::math::pdf(dist, xs[i]);
    }
}
