/**
 * Utils
 */

function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function setText(el, str) {
  if (el) {
    el.innerText = str;
  }
}

function query(key) {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  var i = 0;

  for (; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }

  return vars[key];
}

function setStep(next) {
  var history = window.history || null;

  if (history) {
    history.pushState({ step: next }, next, '?step=' + next);
    load(query('step'));
  } else {
    document.location = '?step=' + next;
  }
}

function createButton(label, next) {
  var btn = document.createElement('button');

  btn.addEventListener('click', setStep.bind(this, next));

  setText(btn, label);
  addClass(btn, 'animated');
  addClass(btn, 'bounceInUp');
  addClass(btn, 'grow');

  return btn;
}

function addButton(containerEl, btnEl) {
  if (containerEl && btnEl) {
    containerEl.appendChild(btnEl);
  }
}

function load(step) {
  var request = window.qRequest;
  var questionEl = document.getElementById('question');
  var answersEl = document.getElementById('answers');
  var currentStep;
  
  var stepToLoad = step || 'greetings';
  var i = 0;

  request.getStepData(stepToLoad, function (s) {
    currentStep = new Step(s);
    
    // Set the current Question
    setText(questionEl, currentStep.question);
    addClass(questionEl, currentStep.transition);

    // Set the current possible answers
    answersEl.innerHTML = null;

    for (; i < currentStep.choices.length; i++) {
      var btn = new Choice(currentStep.choices[i]);
      var btnEl = createButton(btn.label, btn.next);

      addButton(answersEl, btnEl);
    }
  });
}

/**
 * Models
 */

function Step(props) {
  this.name = props.name || '';
  this.question = props.question || '';
  this.choices = props.choices || [];
  this.link = props.link || '';
  this.transition = props.transition || 'fadeIn';
}

function Choice(props) {
  this.label = props.label || '';
  this.next = props.next || 'error';
}

/**
 * Main
 */

(function (window) {
  load(query('step'));

  // Set-up load() to listen for history changes
  window.onpopstate = load.bind(this, history.state.step);
}(window));
