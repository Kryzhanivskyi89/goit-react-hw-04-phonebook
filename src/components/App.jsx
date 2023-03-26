import { useState, useRef, useEffect } from "react";
import Notiflix from 'notiflix';
import { nanoid } from 'nanoid';
import ContactElem from "./ContactElem/ContactElem";
import ContactForm from './ContactForm/ContactForm';
import Filter from "./Filter/Filter";
import ContactList from "./ContactList/ContactList";

const LOCALSTORAGE_KEY = "contacts";

const App = () => {   
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) ?? []
  );

  const [filter, setFilter] = useState('');
  const firstLoad = useRef(false);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(contacts));
    }, [contacts]);

  useEffect(() => {
    if (!firstLoad.current) {
      firstLoad.current = true;
    }
  }, []); 
  
  const addContact = event => {
    event.preventDefault();

    const form = event.target;
    const { name, number } = form.elements;
    const contact = {
      name: name.value,
      number: number.value,
      id: nanoid(),
    };

    if (contacts.find(contact =>
      contact.name.toLowerCase() === name.value.toLowerCase())
      && firstLoad) {
      alert('The contact already exists with this name');
    return;
    }

    setContacts(prev => [...prev, contact]);
    form.reset();
  };

  const deleteContact = (id) => {
    setContacts (prevState =>  prevState.filter(contact => contact.id !== id),
    );
  };

  const inputFilter = (event) => {
    setFilter(event.target.value);
  };

  const visibleContact = () => {    
    const normalizeFilter = filter.toLowerCase();
    return contacts.filter(contact => contact.name.toLowerCase().includes(normalizeFilter));
  }
   
  return (
    <>
      <ContactElem title="Phonebook">
        <ContactForm onSubmit={addContact} />
      </ContactElem>
      <ContactElem title="Contacts">
        {contacts.length > 1 &&
          (<Filter value={filter} onChange={inputFilter} />)
        }
        {contacts.length > 0 ? (<ContactList contacts={visibleContact()} deleteContact={deleteContact} />) :
          ( Notiflix.Notify.warning('Contact book is empty!'))
        }                    
      </ContactElem>
    </>
  );
};


export default App;