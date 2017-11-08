/**
 * Utils
 */

function addClass(el, className) {
  if (!el) return;

  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

function removeClass(el, className) {
  if (!el) return;

  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function removeElement(el) {
  if (!el) return;

  el.outerHTML = '';
  delete el;
}

function setText(el, str) {
  if (el) {
    el.innerText = str;
  }
}

function cloneCurrentStep(el, containerEl) {
  var cloned = el && el.cloneNode(true);
  
  el.id = 'previousstep';
  containerEl.appendChild(cloned);

  el.addEventListener('animationend', removeElement.bind(this, el));
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

function slide(currentEl) {
  addClass(currentEl, 'slideOutUp');
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
  var questionEl;
  var answersEl;
  var request = window.qRequest;

  var stepToLoad = step || 'greetings';
  var currentStep;
  var i = 0;
  
  request.getStepData(stepToLoad, function (s) {
    var currentStepEl;
    var prevStepEl;

    cloneCurrentStep(document.getElementById('currentstep'), document.getElementById('main'));
    
    currentStepEl = document.getElementById('currentstep');
    prevStepEl = document.getElementById('previousstep');
    questionEl = document.getElementsByClassName('question')[1] ? 
      document.getElementsByClassName('question')[1] :
      document.getElementsByClassName('question')[0];
    answersEl = document.getElementsByClassName('answers')[1] ?
      document.getElementsByClassName('answers')[1] :
      document.getElementsByClassName('answers')[0];

    currentStep = new Step(s);
    
    // Set the current Question
    setText(questionEl, currentStep.question);
    addClass(questionEl, currentStep.transition);

    // Set the current possible answers
    if (answersEl) {
      answersEl.innerHTML = null;
    }

    for (; i < currentStep.choices.length; i++) {
      var btn = new Choice(currentStep.choices[i]);
      var btnEl = createButton(btn.label, btn.next);

      addButton(answersEl, btnEl);
    }

    slide(prevStepEl);
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
  // Load for current step
  load(query('step'));

  // Set-up load() to listen for history changes
  window.onpopstate = load.bind(this, history.state && history.state.step);
}(window));
