import json
from django.http import response
from django.http.response import JsonResponse
from django.shortcuts import render
from datetime import date, datetime, time, timedelta


from django.http import HttpResponse, HttpRequest
from django.views.decorators import csrf

import requests
from requests.models import Response


# clinics/clinic100

def index_view(request):


    response= requests.get('http://nn7ff0d9sh.execute-api.eu-west-1.amazonaws.com/foxa/clinics/clinic100/services/ser100/timeslots/2021-10-20', headers={'X-API-Key': 'fkPMcKi8Ou8yUgQcHJeYJ17sgU5h4Lse7LaWwCXj'})

    # print(response.json)


    context = {
        'data' :  response.json
    }



    return render(request, 'index.html', context)


def get_clinic_json(request):

    response= requests.get('http://nn7ff0d9sh.execute-api.eu-west-1.amazonaws.com/foxa/clinics/', headers={'X-API-Key': 'fkPMcKi8Ou8yUgQcHJeYJ17sgU5h4Lse7LaWwCXj'})
    response = response.json()
    
    return JsonResponse(response, safe=False)

def get_service_json(request):

    response= requests.get('http://nn7ff0d9sh.execute-api.eu-west-1.amazonaws.com/foxa/services/', headers={'X-API-Key': 'fkPMcKi8Ou8yUgQcHJeYJ17sgU5h4Lse7LaWwCXj'})
    response = response.json()

    
    return JsonResponse(response, safe=False)


@csrf.csrf_exempt
def get_availability_json(request):
    
    start_date = (request.POST.get('startDate'))
    end_date = (request.POST.get('endDate'))

    service = request.POST.get('service')
    clinic = request.POST.get('clinic')

    print(58, service, clinic)

    start = datetime.strptime(start_date,"%Y-%m-%d")
    end = datetime.strptime(end_date,"%Y-%m-%d")

    print(start, end)

    available_times = []


    date_array = \
    (start + timedelta(days=x +1) for x in range(-1, (end-start).days))

    for date in date_array:
        date = str(date)
        date = date.split(' ')
        date = date[0]
        print(date)
        url = f'http://nn7ff0d9sh.execute-api.eu-west-1.amazonaws.com/foxa/clinics/{clinic}/services/{service}/timeslots/{date}'
        print(url)
        response = requests.get(url, headers={'X-API-Key': 'fkPMcKi8Ou8yUgQcHJeYJ17sgU5h4Lse7LaWwCXj'})

        response = (response.json())

        avialability_instance = {
            'date' : date,
            'times' : response 
        }

        available_times.append(avialability_instance)


    


    response = []
    response = (json.dumps(available_times))

   
    
    return JsonResponse(response, safe=False)



# Create your views here.
