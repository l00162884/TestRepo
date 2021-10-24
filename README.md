#THERAPIE ASSIGNMENT

## SET UP INSTRUCTIONS
- Using -V Python 3.9.5

- Create a python virtual environament in the base dir of the project, by downloading the virtual env library using 'pip install virtualenv'

- Start a new env using command 'python -m virtualenv <name_of_venv>'

- Activate the virtual environment using '<name_of_venv>\scripts\activate'

- Once the venv is active install 'django' and the 'requests' modules using 'pip install django' and 'pip install requests'

## SOLUTION DESCRIPTION

-I used django views to call the services and clinics endpoints,the views returned the data in json format which I then used ajax to call the the django views using ajax one the page had loaded, on the succesful return of the data the data is mapped over and the dropdown boxes for services adn clients are populated with dynamically created option elements with the name of the clinic/service and the values

-The date pickers are using a bootstrap datepicker and the min date of the end date picker is based on the start date to prevent the user from picking an end date before the start date

- After the submit button is hit, instead of using a traditional form the data from the datepickers and dropdowns is collected and sent via post reuqest to the 'get_availbility_json' view in views.py which takes the start and end date to create an array for containing everyday between the two selected dates and the date is used in conjunction with the posted service and clinic value to form the end point to get the availbitys for each date, this is then returned in json format

- The ajax post request returns the json data which is then mapped over to dynamically create a new component for each date that displays the time

- If someone hits the submit button again the javascript will delete the displayed times and create new ones

## KNOWN BUGS
- If the submit button is hit a lot of times the request fails, an solution to this is to disable the button for a few seconds after it is clicked

- The end date is based on the changing of the start date, so the enddate cant be before the start date, however if the start date is changed again the end date wont update to reflect this

-If there is an issue with the values an alert box is shown, I would of liekd to have presented a modal but I ran out of time
