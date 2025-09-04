#include <boost/math/distributions/beta.hpp>
#include <boost/math/policies/policy.hpp>

// `long double` is 80-bit in most systems but it's just an alias of 64-bit double is WASM.
// To avoid convergence problems in some extreme cases (betaPercentile(3, 110, 0.01))
// the following policy is needed.
using boost::math::policies::policy;
using boost::math::policies::promote_double;
using Pol = policy<promote_double<false>>; // stay in double
using Beta = boost::math::beta_distribution<double, Pol>;

extern "C" {
    void betaPercentileDensities(double a, double b, double* xs, double* ys) {
        Beta dist(a, b);
        for (int i = 0; i <= 100; ++i) xs[i] = boost::math::quantile(dist, i / 100.0);
        for (int i = 0; i <= 100; ++i) ys[i] = boost::math::pdf(dist, xs[i]);
    }
}
