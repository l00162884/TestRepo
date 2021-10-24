// BOOTSTRAP DATEPICKER ALLOWS FOR ADDITIONAL PARAMATERS SUCH AS FORMATTING AND  STARTING THE DATEPICKER FROM TODAY,
$(function() {
    $('.start-date').datepicker({
        format: 'yyyy-mm-dd',
        inline: false,
        lang: 'en',
        step: 5,
        multidate: 0,
        closeOnDateSelect: false,
        startDate: new Date(),
        todayHighlighted: true,
        daysOfTheWeekHighlighted: "0,6"


    });

    $('.start-date').on("changeDate", function(e) {
        $('.end-date').datepicker({
            format: 'yyyy-mm-dd',
            inline: false,
            lang: 'en',
            step: 5,
            multidate: 0,
            closeOnDateSelect: false,
            startDate: document.getElementById('start-date').value,
            endDate: "+14d",
            todayHighlighted: true,
            daysOfTheWeekHighlighted: "0,6"


        });

        console.log(document.getElementById('start-date'))
        console.log('hello')


    })



});


// THIS AJAX REQUESTS GETS DATA FROM TJHE PYTHON VIEW 'GET_CLINIC_JSON' WHICH CALLS A GET REQUESTS TO GET THE SERVICES, THE RETURNED DATA IS IN JSON FORMAT 
// THEX-API-HEADER WAS NOT WORKING FOR A SIMPLE AJAX REQUESTS SO I USED THE PYTHON REUQESTS MODULE IINSTEA

$.ajax({
    url: "./get_clinic_json",
    type: 'GET',
    success: function(res) {


        let clinicDropdown = document.getElementById('clinic-dropdown')

        // THE JSON IS 'MAPPED' AND FOR EACH INSTANCE A NEW OPTION IS APPEND TO THE 'CLINIC DROPDOWN MENU FROM ABOVE'



        res.map((item) => {

            let option = document.createElement('option')
            option.innerText = item.city
            option.value = item.clinicId
            clinicDropdown.appendChild(option)
        })
    },
    error: function(error) {
        console.error(error)
    }
});

// SERVICES DROPDOWN IS POPULATED THE SAME AS THE CLINIC DROPDOWN
$.ajax({
    url: "./get_service_json",
    type: 'GET',
    success: function(res) {
        console.log(res);

        let serviceDropdown = document.getElementById('service-dropdown')


        res.map((item) => {


            let option = document.createElement('option')
            option.innerText = item.name
            option.value = item.serviceId
            serviceDropdown.appendChild(option)

        })
    },
    error: function(error) {
        console.error(error)
    }
});

const search = () => {

    document.getElementById('times').style.display = 'block'


    // DELETE PREVIOUSLY CREATED ELEMENTS
    let elements = document.getElementsByClassName('availbility-div')

    while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }


    // USING A JQUERY ON CLICK LISTENER TO COLLECT THE VALUES OF THE DROPDOWNS AFTER THE SUBMIT BUTTON HAS BEEN CLICKED
    let clinic = (document.getElementById('clinic-dropdown').value)
    let service = (document.getElementById('service-dropdown').value)

    let startDate = (document.getElementById('start-date').value)
    let endDate = (document.getElementById('end-date').value)


    // FOMRING A JAVASCRIPT OBJECT TO SEND TO A DJANGO VIEW TO LOOP OVER THE SELECTED DATE RANGE AND GATHER THE AVAILABLE TIEMS FOR THE SERVICE/CLINIC VALUES COLLECTED ABOVE
    let bookingInfo = {
        'startDate': startDate,
        'endDate': endDate,
        'service': service,
        'clinic': clinic

    }
    console.log(bookingInfo)

    // POSTING BOOKING INFO TO THE URL GET_AVAILIBITY_JSON WHICH IS LINKED TO A PYTHON VIEW LOCATED IN ./VIEWS.PY, VIEW THIS FILE FOR MORE INFO


    setTimeout(() => {
        $.ajax({
            url: "./get_availability_json",
            type: 'POST',
            data: bookingInfo,
            success: function(res) {



                // IF THE DATA HAS BEEN POSTED SUCESSFULLY THE PYTHON VIEW RETURNS THE AVIALIITY IN A PYTHON DICTONARY WHIH IS PARSED AS JSON

                let data = (JSON.parse(res))
                console.log(data)
                data.map((item) => {




                    // THE DATA IS MAPPED AND A DIV IS CREATED TO STORE OTHER INFO SUCH AS THE DATE/AVAILBALE TIMES PER DATE

                    let h1 = document.createElement('h4')
                    h1.textContent = item.date + ':'




                    let div = document.createElement('div')
                    div.setAttribute('class', 'availbility-div')
                    div.setAttribute('id', '')

                    div.appendChild(h1)


                    for (let i = 0; i < item.times.length; i++) {
                        span = document.createElement('span')
                        span.setAttribute('class', 'timeslots')


                        // TRIED DATE.PARSE() TO FORMAT THE START/END DATES BUT AN ERROR PERSISSTED SO THE DATES WERE FORMATED BY SPLITTING THE STRING
                        let startTime = item.times[i].startTime.split('T')
                        startTime = startTime[1]
                        startTime = startTime.split(':')
                        startTime = startTime[0] + ':' + startTime[1]

                        let endTime = item.times[i].endTime.split('T')
                        endTime = endTime[1]
                        endTime = endTime.split(':')
                        endTime = endTime[0] + ':' + endTime[1]




                        span.textContent = `TimeSlot: ${startTime} - ${endTime}`
                        div.appendChild(span)
                    }
                    if (item.times.length == undefined) {

                        h1.textContent = `No Times availble on: ${item.date}`
                        div.appendChild(h1)


                    }



                    document.getElementById('available_times').appendChild(div)


                })


            },
            error: function(error) {
                console.error(error)
                alert('Oh No! looks like there is something wrong in your form, check the fields and give it another try :)!!')
            }
        });

    }, 100)


}