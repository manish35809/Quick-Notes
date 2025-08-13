import "./style.css";

const themeToggle = document.getElementById('themeToggle');
      const html = document.documentElement;
      
      // Load theme from localStorage or default to dark
      const currentTheme = localStorage.getItem('theme') || 'dark';
      html.classList.toggle('dark', currentTheme === 'dark');
      
      themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });

      // Get elements
      const noteInput = document.getElementById("noteInput");
      const notesContainer = document.getElementById("notes-container");
      const addButton = document.getElementById("addButton");

      // Load notes from memory (no localStorage)
      let notes = [];
      let editingIndex = null;

      // Syntax highlighting function
      function applySyntaxHighlighting(text) {
        // Simple syntax highlighting patterns
        return text
          // Keywords
          .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await|try|catch|finally|throw)\b/g, '<span class="syntax-keyword">$1</span>')
          // Strings
          .replace(/(['"`])(.*?)\1/g, '<span class="syntax-string">$1$2$1</span>')
          // Numbers
          .replace(/\b\d+\.?\d*\b/g, '<span class="syntax-number">$&</span>')
          // Comments
          .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="syntax-comment">$1</span>')
          // Functions
          .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="syntax-function">$1</span>(')
          // Operators
          .replace(/([+\-*\/=<>!&|]+)/g, '<span class="syntax-operator">$1</span>')
          // Brackets
          .replace(/([{}[\]()])/g, '<span class="syntax-bracket">$1</span>');
      }

      // Auto-resize function for the note input textarea
      function autoResize(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }

      // Function to create note element
      function createNoteElement(note, index) {
        const noteDiv = document.createElement("div");
        noteDiv.className = "group bg-white/90 dark:bg-gray-800/50 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 relative";

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "md:absolute md:top-3 md:right-3 flex flex-wrap gap-2 p-3 md:p-0 justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity border-b border-gray-100 dark:border-gray-700 md:border-0 w-full";

        // Helper to create buttons with mobile-friendly sizing
        const createButton = (icon, color, hoverColor) => {
          const button = document.createElement("button");
          button.className = `p-2.5 md:p-2 ${color} ${hoverColor} rounded-lg transition-all hover:scale-110`;
          const updatedIcon = icon.replace('class="h-4 w-4"', 'class="h-5 w-5 md:h-4 md:w-4"');
          button.innerHTML = updatedIcon;
          return button;
        };

        const isImportant = note.important;

        // Edit Button
        const editButton = createButton(
          `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>`,
          "text-blue-500 hover:bg-blue-500/20",
          "hover:text-blue-600 dark:hover:text-blue-300"
        );

        // Copy Button
        const copyButton = createButton(
          `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>`,
          "text-green-500 hover:bg-green-500/20",
          "hover:text-green-600 dark:hover:text-green-300"
        );

        // Clear Button
        const clearButton = createButton(
          `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>`,
          "text-red-500 hover:bg-red-500/20",
          "hover:text-red-600 dark:hover:text-red-300"
        );

        // Priority buttons
        const upButton = createButton(
          `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
         </svg>`,
          "text-yellow-500 hover:bg-yellow-500/20",
          "hover:text-yellow-600 dark:hover:text-yellow-300"
        );

        const downButton = createButton(
          `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
         </svg>`,
          "text-indigo-500 hover:bg-indigo-500/20",
          "hover:text-indigo-600 dark:hover:text-indigo-300"
        );

        // Star Button
        const starButton = createButton(
          isImportant
            ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
               </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
               </svg>`,
          "hover:bg-yellow-500/20",
          "hover:text-yellow-300"
        );

        if (isImportant) {
          upButton.disabled = true;
          downButton.disabled = true;
          upButton.classList.add("opacity-50", "cursor-not-allowed");
          downButton.classList.add("opacity-50", "cursor-not-allowed");
        }

        const noteContent = document.createElement("div");
        noteContent.className = "whitespace-pre-wrap break-words code-font p-4 pt-4 md:pt-4";
        
        // Apply colorful text in light mode or syntax highlighting
        const isDarkMode = document.documentElement.classList.contains('dark');
        if (!isDarkMode && !note.text.includes('function') && !note.text.includes('const') && !note.text.includes('let')) {
          // For regular text in light mode, apply gradient color
          noteContent.className += " light-mode-text";
          noteContent.textContent = note.text;
        } else {
          // For code-like content or dark mode, apply syntax highlighting
          noteContent.className += " text-gray-800 dark:text-gray-100";
          noteContent.innerHTML = applySyntaxHighlighting(note.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }

        // Button actions
        editButton.onclick = () => {
          editingIndex = index;
          noteInput.value = note.text;
          autoResize(noteInput);
          noteInput.focus();
        };

        copyButton.onclick = () => {
          navigator.clipboard.writeText(note.text);
          copyButton.classList.add("scale-125");
          setTimeout(() => {
            copyButton.classList.remove("scale-125");
          }, 200);
        };

        clearButton.onclick = () => {
          noteDiv.classList.add("scale-95", "opacity-0");
          setTimeout(() => {
            notes = notes.filter((_, i) => i !== index);
            renderNotes();
          }, 200);
        };

        upButton.onclick = () => {
          if (index > 0) {
            [notes[index], notes[index - 1]] = [notes[index - 1], notes[index]];
            renderNotes();
          }
        };

        downButton.onclick = () => {
          if (index < notes.length - 1) {
            [notes[index], notes[index + 1]] = [notes[index + 1], notes[index]];
            renderNotes();
          }
        };

        starButton.onclick = () => {
          notes[index] = { ...notes[index], important: !notes[index].important };
          notes.sort((a, b) => b.important - a.important);
          renderNotes();
        };

        buttonsContainer.append(editButton, copyButton, clearButton, upButton, downButton, starButton);
        noteDiv.appendChild(buttonsContainer);
        noteDiv.appendChild(noteContent);

        return noteDiv;
      }

      function renderNotes() {
        notesContainer.innerHTML = "";
        notes.forEach((note, index) => {
          notesContainer.appendChild(createNoteElement(note, index));
        });
        
        // Scroll to bottom to show latest note
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }

      function addOrUpdateNote() {
        const text = noteInput.value.trim();
        if (text) {
          if (editingIndex !== null) {
            notes[editingIndex] = {
              text,
              important: notes[editingIndex]?.important || false,
            };
            editingIndex = null;
          } else {
            notes.push({ text, important: false });
          }
          noteInput.value = "";
          noteInput.style.height = "auto";
          renderNotes();
        }
      }

      noteInput.addEventListener("input", () => {
        autoResize(noteInput);
      });

      noteInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          addOrUpdateNote();
        } else if (e.key === "Escape") {
          editingIndex = null;
          noteInput.value = "";
          noteInput.style.height = "auto";
        }
      });

      addButton.addEventListener("click", addOrUpdateNote);

      const mediaQuery = window.matchMedia("(max-width: 768px)");
      function handleScreenSize(e) {
        addButton.style.display = e.matches ? "block" : "none";
      }
      mediaQuery.addListener(handleScreenSize);
      handleScreenSize(mediaQuery);

      // Initial render and auto-resize
      renderNotes();
      autoResize(noteInput);

      // Re-render when theme changes to update colors
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            renderNotes();
          }
        });
      });
      observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    </script>
