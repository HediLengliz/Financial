*** Settings ***
Library           RequestsLibrary

*** Variables ***
${BASE_URL}     http://localhost:8071/financial/budgets

*** Test Cases ***
Forecast Project Budget Success
    [Documentation]    Validate that forecast is calculated successfully (HTTP 200)
    Create Session    financial    ${BASE_URL}
    ${response}=      GET On Session    financial    /forecast/11    expected_status=200
    Should Be Equal As Integers    ${response.status_code}    200
    Log    Forecast value: ${response.json()["forecast"]}

Forecast Project Budget Not Found
    [Documentation]    Validate behavior when no past expenses are available (HTTP 404)
    Create Session    financial    ${BASE_URL}
    ${response}=      GET On Session    financial    /forecast/999    expected_status=404
    Should Be Equal As Integers    ${response.status_code}    404
    Log    Message: ${response.json()["message"]}
