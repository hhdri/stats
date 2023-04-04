from datetime import datetime as dt

import numpy as np
import pandas as pd
from scipy.stats import beta
import matplotlib.pyplot as plt

tasks = []

dist_alpha = Element('dist-alpha')
dist_beta = Element('dist-beta')
result1_plc = Element('result1-plc')
result2_plc = Element('result2-plc')

def beta_ci(distribution_α, distribution_β, α=.05, num_samples=200):
    if α > .5:
        raise ValueError('α should be less than 50%.')
    
    distribution = beta(distribution_α, distribution_β)
    
    lower_tails = np.linspace(0, α, num=num_samples)
    upper_tails = α - lower_tails
    
    # The resulting interval will be [p, q]
    ps = distribution.ppf(lower_tails)
    qs = distribution.ppf(1 - upper_tails)
    
    interval_lengths = qs - ps
        
    report_df = pd.DataFrame({
        'lower_tail': lower_tails,
        'interval_start': ps,
        'interval_end': qs,
        'upper_tail': upper_tails,
        'interval_length': interval_lengths
    })
        
    _, shortest_ci = min(report_df.iterrows(), key=lambda x: x[1].interval_length)
    symmetric_ci = distribution.ppf(np.array([α/2, 1-α/2]))
    shortest_ci_report = 'Shortest  CI: [{:.5f}, {:.5f}]'.format(shortest_ci.interval_start, shortest_ci.interval_end)
    symmetric_ci_report = 'Symmetric CI: [{:.5f}, {:.5f}]'.format(symmetric_ci[0], symmetric_ci[1])
    
    plt.rcParams["figure.figsize"] = (3,3)
    plot_xs = np.linspace(0, 1, 101)
    plot_ys = distribution.pdf(plot_xs)
    fig, ax = plt.subplots()
    ax.plot(plot_xs, plot_ys, label='Density')

    segment_xs, segment_ys = np.array([shortest_ci.interval_start, shortest_ci.interval_end]), [0, 0]
    ax.plot(segment_xs, segment_ys, 'b|-', alpha=.5, label='Shortest CI')
    segment_xs, segment_ys = np.array([symmetric_ci[0], symmetric_ci[1]]), [0, 0]
    ax.plot(segment_xs, segment_ys, 'r|-', alpha=.5, label='Symmetric CI')
    ax.legend()
    display(fig, target="graph-area", append=False)


    return report_df.to_json(orient='records'), shortest_ci_report, symmetric_ci_report

def calculate(*args, **kws):
    if dist_alpha.element.value and dist_beta.element.value:
        res = beta_ci(int(dist_alpha.element.value), int(dist_beta.element.value))
        result1_plc.element.innerText = res[1]
        result2_plc.element.innerText = res[2]