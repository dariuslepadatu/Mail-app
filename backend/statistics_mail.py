from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *
from flask import request

def statistics_page():
    jsonObject = request.json
    startDate = jsonObject['startDate']
    endDate = jsonObject['endDate']
    print(startDate)
    print(endDate)	
    stats = getStatistics(startDate, endDate)
    stats_json = stats.decode().replace('\n', '')
    return stats_json

def getStatistics(start_date, end_date):
    sg = SendGridAPIClient('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')
    params = {'start_date': start_date, 'end_date': end_date}

    response = sg.client.stats.get(query_params=params)

    return response.body

# sg = SendGridAPIClient('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')

# params = {'start_date': '2023-07-19', 'end_date' : '2023-07-19'}

# general
# response = sg.client.stats.get(query_params=params)


# by country
# response = sg.client.geo.stats.get(
#     query_params=params
# )

# by device type
# response = sg.client.devices.stats.get(
#     query_params=params
# )

#  by client
# response = sg.client.clients.stats.get(
#     query_params=params
# )

# by client type
# client_type = "phone"
# response = sg.client.clients._(client_type).stats.get(
#     query_params=params
# )

# by mail provider
# response = sg.client.mailbox_providers.stats.get(
#     query_params=params
# )

# by browser
# response = sg.client.browsers.stats.get(
#     query_params=params
# )
# print(response.status_code)
# print(response.body)
# print(response.headers)

