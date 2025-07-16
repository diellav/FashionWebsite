import React,{useState} from 'react';
const FAQ=()=>{
    const[openIndex, setOpenIndex]=useState(null);
     const faqs = [
    {
      question: "What is your return policy?",
      answer: "Returns are accepted within 30 days. Items must be unworn and in original condition.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries. Shipping cost is calculated at checkout.",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days depending on your location.",
    },
    {
      question: "Can I track my order?",
      answer: "Yes, you’ll receive a tracking number once your order ships via email.",
    },
  ];

    const toggle=(index)=>{
         setOpenIndex(index === openIndex ? null : index); //nese eshte pytja e hapur, e mbyll(null), 
         //nese jo e hap ne index
         //e percakton se cila pyetje eshte aktualisht e hapur
         //setOpenIndex po e gjeneron pytjen qe ka me u qel
    }

    return(
       <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className='faq'>
            {faqs.map((faqs,index)=>(
                <div key={index} className='faq-item'>
                    <div className="faq-question" onClick={() => toggle(index)}>
                    <h4>{faqs.question}</h4>
                    <span>{openIndex === index ? "-" : "+"}</span>
                    </div>
                    {openIndex===index &&(
                        <div className='faq-answer'>
                            <p>{faqs.answer}</p>
                        </div>
                    )}

                </div>
            ))}
        </div>
       </div>
    );


};
export default FAQ;
