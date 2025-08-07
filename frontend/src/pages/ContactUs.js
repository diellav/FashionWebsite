import React, {useState} from "react";
import axiosInstance from "../axios";
import '../template/ContactUs.css';
const ContactUs=()=>{
    const[formData,setFormData]=useState({
        first_name:'',
        last_name:'',
        email:'',
        phone_number:'',
        message:'',
});

    const[error, setError]=useState('');
    const [success, setSuccess] = useState(false);
    const handleChange=(e)=>{
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError('');
        try{
            const res=await axiosInstance.post('/contacts',formData);
            setSuccess(true);
            setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            message: '',
            }); 
        }catch(err){
            setError('Failed to send contact input', err);
        }
    };

    return(
        <>
            <div className="main">
                    <div className="mainF">
                    <img src="../../../../images/contact.jpg" alt="Contact" />
                    <div className="txt" style={{left: "35%", top:"10%"}}>
                        <h2 >Contact UrbanGaze</h2>
                        <p id="secondText" >We’re here to help. Let’s talk!</p>
                    </div>
                    </div>
                </div>
                 <div className='contact'>
                <div className="contact-intro">
                    <p className="helper-text">
                    Got a question about your order, want to collaborate, or just say hi?
                    Fill out the form below and our team will get back to you within 24 hours.
                    </p>
                </div>
                <div className="contactForm"><div className="contactsection">
                    <form onSubmit={handleSubmit}>
                    <div className="sector">
                    <input type='text' placeholder="First Name"
                    value={formData.first_name} name='first_name'
                    onChange={handleChange} required></input>
                    <br></br>
                    <input type='text' placeholder="Last Name"
                    value={formData.last_name} name='last_name'
                    onChange={handleChange} required></input></div>
                    <br></br>
                    <div className="sector">
                    <input type='email' placeholder="Email"
                    value={formData.email} name='email'
                    onChange={handleChange} required></input>
                    <br></br>
                    <input type='text' placeholder="Phone Number(Optional)"
                    value={formData.phone_number} name='phone_number'
                    onChange={handleChange} required></input></div>
                    <br></br>
                    <p className="helper-text">Let us know how we can help you. Be as detailed as possible.</p>
                    <textarea placeholder="Your Message..."
                    value={formData.message} name='message'
                    onChange={handleChange} required></textarea>
                    <br></br>
                    <button type='submit'>Send Message</button>
                </form>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {success && <p style={{color: 'green'}}>Message sent successfully!</p>}
      <br/>
                </div>
                </div>
            </div>
            </>
    );
};
export default ContactUs;