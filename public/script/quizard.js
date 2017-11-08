/**
 * Models
 */

function Step(props) {
  this.name = props.name || '';
  this.question = props.question || '';
  this.choices = props.choices || [];
  this.scores = props.scores || [];
  this.links = props.links || '';
  this.transition = props.transition || 'fadeIn';
}

function Choice(props) {
  this.label = props.label || '';
  this.next = props.next || 'error';
}

function Score(props) {
  this.name = props.name || '';
  this.link = props.link || '';
  this.values = props.values || {};
}

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

function createLink(label, href) {
  var container = document.createElement('div');
  var link = document.createElement('a');

  link.href = href;
  link.target = '_blank';

  setText(link, label);
  addClass(container, 'link');
  addClass(container, 'animated');
  addClass(container, 'tada');

  container.appendChild(link);

  return container;
}

function addElement(containerEl, el) {
  if (containerEl && el) {
    containerEl.appendChild(el);
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

    // todo: break all of this up 

    var currentStepEl;
    var prevStepEl;
    var answers;
    var isChoice = false;

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

    if (currentStep.question.length > 40) {
      addClass(questionEl, 'smaller');
    } else {
      removeClass(questionEl, 'smaller');
    }

    // Set the current possible answers
    if (answersEl) {
      answersEl.innerHTML = null;
    }

    // Is the list of answers going to be a list of
    // "Scores"or "Choices?"
    if (currentStep.scores.items) {
      answers = currentStep.scores.items;      
    } else {
      isChoice = true;
      answers = currentStep.choices;
    }

    for (; i < answers.length; i++) {
      var answer = isChoice ? new Choice(answers[i]) : new Score(answers[i]);
      var el = isChoice ? createButton(answer.label, answer.next) : createLink(answer.name, answer.link)
      addElement(answersEl, el);
    }

    slide(prevStepEl);
  });
}

/**
 * Main
 */

(function (window) {
  // Load for current step
  load(query('step'));

  // Set-up load() to listen for history changes
  window.onpopstate = load.bind(this, window.history.state && window.history.state.step);
}(window));
