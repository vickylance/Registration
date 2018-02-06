var msgsContainer = $('.messages-content')
var userInputField = $('#userInputText')
var botMsgCounter = 0
var socket = io()


$(document).ready(function () {
  var clickDisabled = false
  insertBotMessage(1)
  clickDisabled = true
  setTimeout(function () {
    clickDisabled = false
  }, 10000)
  $userInputField = $('#userInputText')
  // check that your browser supports the API
})

function getBrowser() {
  var ua = navigator.userAgent
  var bl = navigator.language
  var tem
  var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || []
    return {
      name: 'IE',
      version: (tem[1] || '')
    }
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/)
    if (tem != null) {
      return {
        name: 'Opera',
        version: tem[1]
      }
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1])
  }
  return {
    name: M[0],
    version: M[1],
    blanguage: bl
  }
}

function playSound(filename) {
  $('<audio autoplay="autoplay"><source src="../assets/' + filename + '.mp3" type="audio/mpeg" /><source src="../assets/' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="../assets/' + filename + '.mp3" /></audio>').appendTo($('#sound'))
}

function setTimeStamp(customTimeStamp) {
  if ($.trim(customTimeStamp) === '') {
    $('<div class="timestamp">' + formatAMPM(new Date()) + '</div>').appendTo($('.message:last'))
    return false
  }
  $('<div class="timestamp">' + customTimeStamp + '</div>').appendTo($('.message:last'))
}

function setTyping() {
  var correctElement = msgsContainer.find('.mCSB_container')
  if (!correctElement.length) {
    console.log('No element found with .mCSB_container')
    return false
  }
  $('<div class="message loading new"><figure class="avatar"><img src="../assets/icon.png" /></figure><span></span></div>').appendTo(correctElement)
  $('<div class="timestamp">Typing...</div>').appendTo($('.message:last'))
  updateScrollbar()
}

function disableUserInput(placeholderText) {
  placeholderText = placeholderText || 'Please Wait...' // Default text
  userInputField.blur() // Remove the focus from the user input field
  userInputField.val('') // Remove the text from the user input field
  userInputField.attr('disabled', 'true') // Disable the user input field
  userInputField.attr('placeholder', placeholderText) // Change the placeholder to ask the user to wait
  $('.message-box').css('font-size', '15px')
  $('.message-box').addClass('disabledCursor')
  $('.message-submit').attr('disabled', 'true')
}

function enableUserInput(placeholderText) {
  placeholderText = placeholderText || 'Please Type!' // Default text
  userInputField.focus() // Remove the focus from the user input field
  userInputField.val('') // Remove the text from the user input field
  userInputField.removeAttr('disabled') // Enable the user input field
  userInputField.attr('placeholder', placeholderText) // Change the placeholder to prompt input from the user
  $('.message-box').removeClass('disabledCursor')
  $('.message-submit').removeAttr('disabled')
}

function insertUserMessage(msg) {
  if ($.trim(msg) === '') {
    return false
  }
  var correctElement = msgsContainer.find('.mCSB_container')
  if (!correctElement.length) {
    return false
  }
  $('<div class="message new message-personal">' + msg + '</div>').appendTo(correctElement)
  setTimeStamp()
  $('.message-input').val('')
  $('.message.loading').remove()
  $('.message.timestamp').remove()
  updateScrollbar()
}

function displayBotMessage(botMessage, timeout, choices) {
  console.log("display function called")
  if ($.trim(botMessage) === '') {
    return false
  }
  var correctElement = msgsContainer.find('.mCSB_container')
  if (!correctElement.length) {
    return false
  }
  setTimeout(function () {
    setTyping()
  }, 1000)
  setTimeout(function () {
    $('<div class="message new"><figure class="avatar"><img src="../assets/icon.png" /></figure>' + botMessage + '</div>').appendTo(correctElement)
    setTimeStamp()
    $('.message.loading').remove()
    $('.message.timestamp').remove()
    updateScrollbar()
    playSound('bing')
  },3000)
  setTimeStamp()
  playSound('bing')
  // if the choices exists and has atleast 2 choices
  if (choices !== undefined && choices.length > 1) {
    setTimeout(function () {
      setTyping()
    }, 4000)
    var choicesBotMessage = '<div class="chatBtnHolder new">'
    for (var i = 0; i < choices.length; i++) {
      choicesBotMessage += '<button class="chatBtn" onclick="choiceClick(\'' + i + '\')" value="' + choices[i] + '">' + choices[i] + '</button>'
    }
    choicesBotMessage += '</div>'
    setTimeout(function () {
      $(choicesBotMessage).appendTo(correctElement)
      playSound('bing')
      $('.message.loading').remove()
      $('.message.timestamp').remove()
      updateScrollbar()
    }, 4000)
  }
  $('.message.loading').remove()
  $('.message.timestamp').remove()
  updateScrollbar()
}

socket.on('finalmsg', function (data) {
  console.log('final value client side' + data.msg)

  if ($.trim(data) === '') {
    return false
  }
  var correctElement = msgsContainer.find('.mCSB_container')
  if (!correctElement.length) {
    return false
  }

  setTimeout(function () {
    setTyping()
  }, (3000 || 1) / 2)
  setTimeout(function () {
    $('<div class="message new"><figure class="avatar"><img src="../assets/icon.png" /></figure>' + data.msg + '</div>').appendTo(correctElement)
    setTimeStamp()
    $('.message.loading').remove()
    $('.message.timestamp').remove()
    updateScrollbar()
    playSound('bing')
  }, 2000)
  setTimeStamp()
  playSound('bing')
  // if the choices exists and has atleast 2 choices
  if (data.choices !== undefined && data.choices.length > 1) {
    var choicesBotMessage = '<div class="chatBtnHolder new">'
    for (var i = 0; i < data.choices.length; i++) {
      choicesBotMessage += '<button class="chatBtn" onclick="choiceClick(\'' + i + '\')" value="' + data.choices[i] + '">' + data.choices[i] + '</button>'
    }
    choicesBotMessage += '</div>'
    setTimeout(function () {
      $(choicesBotMessage).appendTo(correctElement)
      playSound('bing')
      $('.message.loading').remove()
      $('.message.timestamp').remove()
      updateScrollbar()
    }, 3000 || 10)
  }
})
socket.on('chat message', function (msg) {
  console.log('inside chat socket' + msg)
  botMessage({
    message: msg,
    type: 'normal'
  })
});

function botMessage(botMsg) {
  if (!botMsg) return false
  highChartsContainerID = []
  $('.message.loading').remove()
  $('.message.timestamp').remove()
  var temp = ''
  var rendered
  console.log("This is the bot message "+JSON.stringify(botMsg, null, 2));
  if (botMsg.type === 'feedback') {
    temp = $('#feedbackTemplate').clone()
  } else if (botMsg.type === 'normal' || !(botMsg.type)) {
      console.log("Inside normal message and this is the message found "+JSON.stringify(botMsg, null, 2) +" and also msg is "+botMsg.message);
      temp = $('#normalMessage').clone().html()
      Mustache.parse(temp)
      rendered = Mustache.render(temp, {
        message: botMsg.message
      })
      console.log("\n");
      console.log("This is the message about to be printed "+JSON.stringify(rendered, null, 2));
      temp = $(rendered)
  } else if (botMsg.type === 'video') {
    temp = $('#videoTemplate').clone().html()
    Mustache.parse(temp)
    rendered = Mustache.render(temp, {
      attr: 'src',
      attrVal: botMsg.data
    })
    temp = $(rendered)
  } else if (botMsg.type === 'audio') {
    temp = $('#audioTemplate').clone().html()
    Mustache.parse(temp)
    rendered = Mustache.render(temp, {
      attr: 'src',
      attrVal: botMsg.data
    })
    temp = $(rendered)
  } else if (botMsg.type === 'herocard') {
    // console.log(displayCard(botMsg.data))
    temp = $(displayCard(botMsg.data).wrap('<p/>').parent())
  } else if (botMsg.type === 'choices') {
    var chtemp = $('#choicesMessage').clone().html()
    Mustache.parse(temp)
    rendered = Mustache.render(chtemp, {
      message: botMsg.message,
      choices: faqs(botMsg.data)
    })
    temp = $(rendered)
  } else if (botMsg.type === 'highChart') {
    temp = $('#highChartTemplate').clone().html()
    Mustache.parse(temp)
    var tempID = 'chartContainer' + (chartContainer++)
    highChartsContainerID.push(tempID)
    rendered = Mustache.render(temp, {
      chartContainer: tempID,
      highChart: function () {
        return function (text, render) {
          return render(text)
        }
      }
    })
    temp = $(rendered)
  } else if (botMsg.type === 'value') {
    temp = $('#statMessage').clone().html()
    console.log(botMsg.comparer.positive)
    console.log(botMsg.comparer.compareText)
    console.log(botMsg.comparer.compareValue)
    console.log('hi')
    rendered = Mustache.render(temp, {
      message: botMsg.message,
      actualValue: botMsg.achieved.actualValue,
      targetValue: botMsg.achieved.targetValue,
      positive: botMsg.comparer.positive,
      compareText: botMsg.comparer.compareText,
      compareValue: botMsg.comparer.compareValue
    })
    temp = $(rendered)
  }

  function botMsgCounterId() {
    return 'botMsg' + (botMsgCounter++)
  }

  function setDate(t) {
    date = new Date()
    $(t).find('.message').append($('<div class="timestamp">' + formatAMPM(date) + '</div>'))
  }
  setDate(temp)
  var id = botMsgCounterId()
  console.log("Printed on line 291");
  console.log('temp is '+JSON.stringify(temp))
  $('.mCSB_container').append($(temp.html()).attr('id', id))
  if (botMsg.type === 'herocard') {
    // console.log($('#'+id).find('.rslides').html() + '\n\n\n ---------------------------------------------- \n\n\n')
    $('#' + id).find('.rslides').responsiveSlides({
      auto: false,
      nav: true,
      prevText: '<i class="fa fa-arrow-left fa-2x" aria-hidden="true"></i>',
      nextText: '<i class="fa fa-arrow-right fa-2x" aria-hidden="true"></i>',
      pager: true
    })
  }
  if (botMsg.type === 'highChart') {
    chart = renderHighChart(highChartsContainerID.shift(), regionalMonth)
    chart.setSize(320)
  }
  if (botMsg.type === 'herocard') {
    for (var i = 0; i < botMsg['data']['carousel']['container'].length; i++) {
      var card = botMsg['data']['carousel']['container'][i]
      if (card.hasOwnProperty('highChart')) {
        chart = renderHighChart(highChartsContainerID.shift(), card['highChart'])
      }
    }
  }
  updateScrollbar()
  playSound('bing')
}
$('#end-chat').click(function () {
  msgsContainer.find('.chatBtn').attr('disabled', true) 
  botMessage({
    message: 'Please provide us a feedback',
    type: 'feedback'
  })
  $('.feedback-bar').hide()
  disableUserInput('Thank you for using our services')
})

function updateScrollbar() {
  msgsContainer.mCustomScrollbar('update').mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  })
}

function formatAMPM(date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

var setTimeoutID
$('#minim-chat').click(function () {
  $('#minim-chat').css('display', 'none')
  $('#maxi-chat').css('display', 'block')
  // var height = (j(".chat").outerHeight(true) - 46) * -1;
  // j(".chat").css("margin", "0 0 " + height + "px 0");
  $('.chat').css('margin', '0 0 ' + -($('.chat').outerHeight() - $('.chat-title').outerHeight()) + 'px 0')
  setTimeoutID = setTimeout(function () {
    $('#animHelpText').css('display', 'block')
  }, 1500)
})
$('#maxi-chat').click(function () {
  $('#minim-chat').css('display', 'block')
  $('#maxi-chat').css('display', 'none')
  $('.chat').css('margin', '0')
  $('#animHelpText').css('display', 'none')
  clearTimeout(setTimeoutID)
})

var botDialogs = {}
var botDialogsLength

var getJson = $.getJSON('../assets/data_back.json', function (data) {
  $(data).each(function (index, val) {
    botDialogs[val['id']] = val
  })
  botDialogsLength = data.length
})

getJson.error(function (jqxhr, textStatus, error) {
  var err = textStatus + ', ' + error
})

getJson.success(function () {
  msgsContainer.mCustomScrollbar()

  var browser = getBrowser()
  userDataLogger('BrowserName', browser.name)
  userDataLogger('BrowserVersion', browser.version)
  userDataLogger('Browserlanguage', browser.blanguage)
  insertBotMessage(1) // Start the botDialogs
})

var nextResponses = []
var choices = []
var botMsgType
var userMsgType, userIptVar
var fnName, correctAnswer, correctquestion
var retryPrompt

// recurring function
function insertBotMessage(id) {
  console.log("insert called")
  console.log('id is :'+id)
  console.log(botDialogsLength)
  if (id > 0 && id <= botDialogsLength) { // check if the id is valid
    botMsgType = botDialogs[id].botMessageType // determine the botMsgType
    userMsgType = getUserMessageType(botDialogs[id]) // determine the userMsgType
    retryPrompt = botDialogs[id].retryPrompt ? getRandom(botDialogs[id].retryPrompt) : 'Please enter the correct input.' // determine the retryPrompt
    console.log('botmsg type is : '+botMsgType)
    switch (botMsgType) {
      case 'text':
      console.log('inside text')
        displayBotMessage(getRandom(botDialogs[id].botMessage), 2000)
        determineNextResponses(botDialogs[id])
        enableUserInput('Please type!')
        break

      case 'address':
        displayBotMessage(getRandom(botDialogs[id].botMessage), 2000)
        determineNextResponses(botDialogs[id])
        enableUserInput('Please type!')
        break
      case 'confirm':
        choices = ['yes', 'no']
        displayBotMessage(getRandom(botDialogs[id].botMessage), 2000, choices)
        determineNextResponses(botDialogs[id])
        disableUserInput('Please select yes/no above')
        break

      case 'choice':
        returnChoices(botDialogs[id].choice)
        displayBotMessage(getRandom(botDialogs[id].botMessage), undefined, choices)
        determineNextResponses(botDialogs[id])
        disableUserInput('Please select your Choice above')
        break

      case 'dialog':
      console.log('inside dialog')
        displayBotMessage(botDialogs[id].botMessage)
        determineNextResponses(botDialogs[id])
        insertBotMessage(nextResponses[0])
        break

      case 'autocomplete':
        console.log('inside autocomplete insert bot message')
        enableUserInput('Hint: What is / How to')
        displayBotMessage(botDialogs[id].botMessage)
        determineNextResponses(botDialogs[id])
        break

      case 'year':
        enableUserInput('Please pick DD-MM-YYYY!')
        displayBotMessage(botDialogs[id].botMessage)
        determineNextResponses(botDialogs[id])
        break

      default:
        console.log('Unknown botMsgType !!')
        break
    }
  }
}

function getRandom(arrayResp) {
  var retResponse
  if ($.isArray(arrayResp)) { // its an array
    retResponse = arrayResp[Math.floor((Math.random() * arrayResp.length))]
  } else { // its not an array
    retResponse = arrayResp
  }
  return retResponse
}

function getUserMessageType(botDialog) {
  var retUserMsgType
  if (botDialog.userMessageType && botMsgType !== 'dialog') {
    retUserMsgType = botDialog.userMessageType // determine the userMsgType
    if (/<fn>/.test(retUserMsgType)) {
      fnName = retUserMsgType.split('<fn>')[1]
      retUserMsgType = 'function'
    } else {
      fnName = undefined
    }
  } else {
    retUserMsgType = undefined
  }
  return retUserMsgType
}

function returnChoices(choicesArray) {
  choices = []
  for (var i = 0; i < choicesArray.length; i++) {
    choices.push(getRandom(choicesArray[i].option))
  }
}

function determineNextResponses(botMessage) {
  nextResponses = []
  switch (botMsgType) {
    case 'text':
      nextResponses[0] = botMessage.nextResponse
      userIptVar = botMessage.userInputVar
      break

    case 'address':
      nextResponses[0] = botMessage.nextResponse
      userIptVar = botMessage.userInputVar
      break

    case 'choice':
      for (var i = 0; i < botMessage.choice.length; i++) {
        nextResponses.push(botMessage.choice[i].nextResponse)
      }
      break

    case 'confirm':
      nextResponses = botMessage.nextResponse
      break

    case 'dialog':
      nextResponses[0] = botMessage.nextResponse
      break

    case 'autocomplete':
      console.log('determine nxt response autocomplete')
      var messageContent = botMessage.botMessage
      userIptVar = botMessage.userInputVar
      // nextResponses[0] = botMessage.nextResponse
      console.log('value' + messageContent)
      if (messageContent.match(/Action/g)) {
        console.log(messageContent)
        let loadQues
        loadQues = faq_action
        console.log(JSON.stringify(faq_action))
        //disable a div element that started to appear in the DOM as the values were hovered upon
        $( "#userInputText" ).autocomplete({
          focus: function (event, ui) {
                          $(".ui-helper-hidden-accessible").hide();
                          event.preventDefault();
                      }
          });
        $('#userInputText').autocomplete({
          source: function (request, response) {
            var results = $.ui.autocomplete.filter(Object.keys(loadQues), request.term)
            response(results.slice(0, 10))
          },
          maxResults: 10,
          multiple: true,
          mustMatch: true,
          position: {
            my: 'left bottom-15',
            at: 'left bottom-15',
            of: '#userInputText',
            collision: 'flip'
          },
          
          select: function (event, ui) {
            if (ui.item.value in loadQues) {
              // correctAnswer = loadQues[ui.item.value]
              correctquestion = ui.item.value
            }
          },
          messages: {
            noResults: '',
            results: function () {}
          }
        })
      }
      break

    case 'year':
      userIptVar = botMessage.userInputVar
      $('#userInputText').datepicker({
        changeMonth: true,
        changeYear: true
      })
      nextResponses[0] = botMessage.nextResponse
      break

    default:
      console.log('Unknown botMsgType 2 !!')
      break
  }
}

// Feedback Mechanism

$('body').on('click', '.emoji', function () {
  $('.emoji').each(function () {
    $(this).attr('isactive', 'false')
    $(this).removeClass('jqactive')
  })
  $(this).addClass('jqactive')
  $(this).attr('isactive', 'true')
})

$('body').on('click', '#send_feedback', function (e) {
  console.log('inside feedback button click function')
  if ($('textarea').val().length === 0) {
    e.preventDefault()
  } else {
    console.log('inside the feedbck')
    insertBotMessage(6)
    // botMessage({
    //   message: msg,
    //   type: 'normal'
    // })
    $(this).prop('disabled', true)
  }
})
$('body').on('click', '#userInputSubmit', function (e) {
  $('ul').hide()
})
function choiceClick(selectedChoice) {
  msgsContainer.find('.chatBtn').attr('disabled', true) // disable all the buttons in the messages window
  insertUserMessage(choices[selectedChoice])
  insertBotMessage(nextResponses[selectedChoice])
}

function isValidEmail(email) {
  var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/
  return re.test(email)
}

function isValidAddress(str) {
  if (str !== undefined && str !== null && str !== '' && $.trim(str) !== '') {
    return !/^[a-z0-9\s,'-]*$/g.test(str)
  } else {
    return false
  }
}

function isValidString(str) {
  if (str !== undefined && str !== null && str !== '' && $.trim(str) !== '') {
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str)
  } else {
    return false
  }
}


function isValidNumber(str) {
  return !isNaN(str)
}

function isValidDate(str) {
  $('#userInputText').datepicker('destroy')
  return true
}

function generateRandomName() {
  var randomGender = Math.floor(Math.random() * 2)
  var males = ['Sathish', 'Robert', 'Dhanish', 'Parker', 'Zeeshan', 'Vinay', 'Rathod', 'Vijayan', 'Aashish', 'Bharath', 'Ajith', 'Nithin', 'Ramesh']
  var females = ['Aarthi', 'Aswathy', 'Swathy', 'Trisha', 'Gayathri', 'Nivethitha', 'Shruthi', 'Yamini', 'Preethi', 'Dharini', 'Sindhuja']
  var randomName
  if (randomGender === 1) {
    randomName = 'Mr.' + males[Math.floor(Math.random() * males.length)]
  } else {
    randomName = ((Math.random() < 0.5) ? 'Mrs.' : 'Ms.') + females[Math.floor(Math.random() * females.length)]
  }
  return randomName
}

function validate() {
  console.log("Submit call")
  var userInputText = userInputField.val()
  switch (userMsgType) {
    case 'text':
      if (isValidString(userInputText)) {
        console.log('text submit -------------' + userInputText)
        userDataLogger(userIptVar, userInputText)
        insertUserMessage(userInputText)
        insertBotMessage(nextResponses[0])
        retryPrompt = ''
      } else {
        displayBotMessage(retryPrompt)
      }
      break

    case 'address':
      if (isValidAddress(userInputText)) {
        console.log('text submit -------------' + userInputText)
        userDataLogger(userIptVar, userInputText)
        insertUserMessage(userInputText)
        insertBotMessage(nextResponses[0])
        retryPrompt = ''
      } else {
        displayBotMessage(retryPrompt)
      }
      break
    case 'number':
      if (isValidNumber(userInputText)) {
        userDataLogger(userIptVar, userInputText)
        insertUserMessage(userInputText)
        insertBotMessage(nextResponses[0])
        retryPrompt = ''
      } else {
        displayBotMessage(retryPrompt)
      }
      break

    case 'function':
      if (typeof window[fnName] === 'function') {
        if (window[fnName](userInputText)) { // Test if the user defined function validates true for the userInput given.
          console.log('text submit -------------' + userInputText)
          userDataLogger(userIptVar, userInputText)
          insertUserMessage(userInputText)
          insertBotMessage(nextResponses[0])
          retryPrompt = ''
        } else {
          if (!$('.message.new:last').text().match(/car make/g)) {
            displayBotMessage(retryPrompt)
          }
        }
      } else {
        console.log('There was no function with the function name "' + fnName + '" defined.')
      }
      break

    case 'year':
      if (isValidDate(userInputText)) {
        userDataLogger(userIptVar, userInputText)
        insertUserMessage(userInputText)
        insertBotMessage(nextResponses[0])
        retryPrompt = ''
      } else {
        displayBotMessage(retryPrompt)
      }
      break

    case 'autocomplete':
      if (correctquestion === undefined) {
        console.log('text submit -------------' + userInputText)
        insertUserMessage(userInputText)
        console.log('have to check for luis responses now')
        socket.emit('chat message', {
          msg: userInputText
        })
        // checkDialogFlowResonse(userInputText)
      } else {
        insertUserMessage(userInputText)
        console.log('text submit -------------' + userInputText)
        setTimeout(function () {
          console.log('question is ' + correctquestion)
          socket.emit('chat message', {
            msg: userInputText
          })
          correctAnswer = 'Please select your question from the given list.'
        }, 500)
      }
      break

    default:
      console.log('userMsgType not found: ' + userMsgType)
      break
  }
  return false
}

// // get DialogFlow(API.AI) response
// var accessToken = 'e064788bb7114ee888b7ce2cb971512a'
// var baseUrl = 'https://api.api.ai/v1/'

function checkDialogFlowResonse(userinputtxt) {
  $.ajax({
    url: baseUrl + 'query',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json; charset=utf-8',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    data: JSON.stringify({
      query: userinputtxt,
      lang: 'en',
      sessionId: 'yaydevdiner'
    }),
    success: function (data, status) {
      console.log(data)
      setTimeout(function () {
        displayBotMessage(data['result']['speech'])
      }, 1000)
    }
  })
}

var logger = {}
// store user data in a varible to display
function userDataLogger(inputKey, inputValue) {
  logger[inputKey] = inputValue
  console.log(logger)
}

$('#generalForm').bind('submit', validate)