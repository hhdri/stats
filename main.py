import numpy as np
from scipy.stats import beta
import matplotlib.pyplot as plt

tasks = []

dist_alpha = Element('dist-alpha')
dist_beta = Element('dist-beta')
result1_plc = Element('result1-plc')
result2_plc = Element('result2-plc')


def get_cis_linspace(distribution_α, distribution_β, α, num_samples):
    distribution = beta(distribution_α, distribution_β)
    
    lower_tails = np.linspace(0, α, num=num_samples)
    upper_tails = α - lower_tails
    
    # The resulting interval will be [p, q]
    ps = distribution.ppf(lower_tails)
    qs = distribution.ppf(1 - upper_tails)
    
    interval_lengths = qs - ps
    
    return list(zip(lower_tails, ps, qs, upper_tails, interval_lengths))

def beta_ci(distribution_α, distribution_β, plot_id, α=.05, num_samples=100):
    if α > .5:
        raise ValueError('α should be less than 50%.')
    
    cis = get_cis_linspace(
        distribution_α=distribution_α,
        distribution_β=distribution_β,
        α=α,
        num_samples=num_samples
    )
    
    distribution = beta(distribution_α, distribution_β)
    symmetric_ci = distribution.ppf(np.array([α/2, 1-α/2]))
    
    cis.append((α/2, symmetric_ci[0], symmetric_ci[1], α/2, symmetric_ci[1] - symmetric_ci[0]))
    
    shortest_ci = min(cis, key=lambda x: x[4])
    symmetric_ci = cis[-1]

    plt.rcParams["figure.figsize"] = (7, 4)
    fig, ax = plt.subplots()
    
    plot_start = distribution.ppf(max(min(shortest_ci[0], symmetric_ci[0]) - .015, 0))
    plot_end = distribution.ppf(min(max(1 - shortest_ci[3], 1 - symmetric_ci[3]) + .015, 1))

    plot_xs = np.linspace(plot_start, plot_end, 101)
    plot_ys = distribution.pdf(plot_xs)
    ax.plot(plot_xs, plot_ys, label='Density')
    
    plot_xs = np.linspace(shortest_ci[1], shortest_ci[2], 101)
    plot_ys = distribution.pdf(plot_xs)
    ax.fill_between(plot_xs, plot_ys, step="mid", alpha=0.1, color='blue')

    plot_xs = np.linspace(symmetric_ci[1], symmetric_ci[2], 101)
    plot_ys = distribution.pdf(plot_xs)
    ax.fill_between(plot_xs, plot_ys, step="mid", alpha=0.1, color='red')

    segment_xs, segment_ys = np.array([shortest_ci[1], shortest_ci[2]]), [0, 0]
    ax.plot(segment_xs, segment_ys, 'b|-', alpha=.7, label='Shortest CI')
    segment_xs, segment_ys = np.array([symmetric_ci[1], symmetric_ci[2]]), [0, 0]
    ax.plot(segment_xs, segment_ys, 'r|-', alpha=.7, label='Symmetric CI')

    ax.legend()
    display(fig, target=plot_id, append=False)

    return {
        'shortest_ci': shortest_ci,
        'symmetric_ci': symmetric_ci
    }



def calculate(*args, **kws):
    if dist_alpha.element.value and dist_beta.element.value:
        res = beta_ci(int(dist_alpha.element.value), int(dist_beta.element.value), 'graph-area')
        pretty_print_interval = lambda x: f'Left Tail: {x[0]:.3f}, Interval: [{x[1]:.5f}, {x[2]:.5f}], Right Tail: {x[3]:.3f}, Interval Length: {x[4]:.4f}'
        result1_plc.element.innerText = 'Shortest  CI: ' + pretty_print_interval(res['shortest_ci'])
        result2_plc.element.innerText = 'Symmetric CI: ' + pretty_print_interval(res['symmetric_ci'])