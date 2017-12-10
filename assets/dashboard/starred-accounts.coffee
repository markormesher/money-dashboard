$(document).ready(() ->
	for account in starredAccounts
		chart = makeChart(account['id'])
		populateChart(chart, account)
)

makeChart = (id) ->
	return new Chart($('#history-chart-' + id), {
		type: 'line'
		data: { datasets: [] }
		options: {
			elements: {
				line: {
					tension: 0
				}
				point: {
					radius: 1
				}
			}
			tooltips: {
				callbacks: {
					title: (item, data) -> new moment(item[0].xLabel).format('DD MMM')
					label: (item, data) -> '  Balance: ' + window.formatters.formatCurrency(item.yLabel)
				}
			}
			scales: {
				yAxes: [{
					type: 'linear'
					position: 'left'
					ticks: {
						callback: (value) -> window.formatters.formatCurrency(value)
						beginAtZero: window.user.settings['report_bal_history_settings_start_at_zero'] == 'yes'
					}
				}]
				xAxes: [{
					type: 'linear'
					position: 'bottom'
					ticks: { callback: (value) -> moment(value).format('DD MMM') }
				}]
			}
			legend: {
				display: false
			}
		}
	})

populateChart = (chart, account) ->
	dataset = {
		label: 'Balance'
		borderColor: 'rgba(115, 135, 156, 1.0)'
		backgroundColor: 'rgba(115, 135, 156, 0.2)'
		data: []
	}
	for d in account['history']
		dataset.data.push({
			x: moment(d['date'])
			y: d['balance']
		})
	chart.data.datasets = [dataset]
	chart.update()
