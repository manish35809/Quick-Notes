import './style.css'

const noteInput = document.getElementById('noteInput');
const notesContainer = document.getElementById('notes-container');
const addButton = document.getElementById('addButton');
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let editingIndex = null;

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

function createNoteElement(text, index) {
  const noteDiv = document.createElement('div');
  noteDiv.className = 'group bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-blue-500/10';
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity';
  
  const createButton = (icon, color, hoverColor) => {
    const button = document.createElement('button');
    button.className = `p-2 ${color} ${hoverColor} rounded-lg transition-all hover:scale-110`;
    button.innerHTML = icon;
    return button;
  };

  const editButton = createButton(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  `, 'text-blue-400 hover:bg-blue-500/20', 'hover:text-blue-300');
  
  const copyButton = createButton(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  `, 'text-green-400 hover:bg-green-500/20', 'hover:text-green-300');
  
  const clearButton = createButton(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  `, 'text-red-400 hover:bg-red-500/20', 'hover:text-red-300');
  
  const noteContent = document.createElement('pre');
  noteContent.className = 'whitespace-pre-wrap break-words font-sans p-4 text-gray-100';
  noteContent.textContent = text;
  
  editButton.onclick = () => {
    editingIndex = index;
    noteInput.value = text;
    autoResize(noteInput);
    noteInput.focus();
  };
  
  copyButton.onclick = () => {
    navigator.clipboard.writeText(text);
    copyButton.classList.add('scale-125');
    setTimeout(() => {
      copyButton.classList.remove('scale-125');
    }, 200);
  };
  
  clearButton.onclick = () => {
    noteDiv.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      notes = notes.filter((_, i) => i !== index);
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    }, 200);
  };
  
  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(copyButton);
  buttonsContainer.appendChild(clearButton);
  noteDiv.appendChild(buttonsContainer);
  noteDiv.appendChild(noteContent);
  
  return noteDiv;
}

function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    notesContainer.prepend(createNoteElement(note, index));
  });
}

function addOrUpdateNote() {
  const text = noteInput.value.trim();
  if (text) {
    if (editingIndex !== null) {
      notes[editingIndex] = text;
      editingIndex = null;
    } else {
      notes.push(text);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    noteInput.value = '';
    noteInput.style.height = 'auto';
    renderNotes();
  }
}

noteInput.addEventListener('input', () => {
  autoResize(noteInput);
});

noteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addOrUpdateNote();
  } else if (e.key === 'Escape') {
    editingIndex = null;
    noteInput.value = '';
    noteInput.style.height = 'auto';
  }
});

addButton.addEventListener('click', addOrUpdateNote);

// Show/hide add button based on screen size
const mediaQuery = window.matchMedia('(max-width: 768px)');
function handleScreenSize(e) {
  addButton.style.display = e.matches ? 'block' : 'none';
}
mediaQuery.addListener(handleScreenSize);
handleScreenSize(mediaQuery);

// Initial render
renderNotes();

// Initial textarea size
autoResize(noteInput);