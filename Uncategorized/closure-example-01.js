function addClickListener() {
  function log() {
    console.log('click');
  }

  document.addEventListener('click', log);

  return () => {
    console.log('removed');
    document.removeEventListener('click', log);
  };
}

const listenerController = addClickListener(); // addEventListener
listenerController(); // removeEventListener
