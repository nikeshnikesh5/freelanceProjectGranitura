  "use client";

  import { useState } from "react";
  import "./contact.css";

  import emailjs from "@emailjs/browser";


  export default function ContactSection() {
    const [form, setForm] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      projectType: "",
      stoneInterest: "",
      vision: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;

      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

  //   const handleSubmit = () => {
  //     // console.log("Form Data:", form);

  //     // // API call here if needed
  //     // // fetch("/api/contact", {
  //     // //   method: "POST",
  //     // //   headers: { "Content-Type": "application/json" },
  //     // //   body: JSON.stringify(form),
  //     // // });

  //     // alert("Enquiry submitted successfully!");


  //     const handleSubmit = async () => {
  //   // Basic validation
  //   if (
  //     !form.firstName ||
  //     !form.email ||
  //     !form.phone ||
  //     !form.projectType
  //   ) {
  //     alert("Please fill all required fields.");
  //     return;
  //   }

  //   try {
  //     const response = await emailjs.send(
  //       "service_7qqwqo9",          // Your Service ID
  //       "template_ckbolln",         // Replace with your Template ID
  //       { 
  //         firstName: form.firstName,
  //         lastName: form.lastName,
  //         email: form.email,
  //         phone: form.phone,
  //         projectType: form.projectType,
  //         stoneInterest: form.stoneInterest,
  //         vision: form.vision,
  //       },
  //       "wny2_UjWVlpMiE263"           // Replace with your Public Key
  //     );

  //     console.log("SUCCESS!", response);

  //     alert("Enquiry submitted successfully!");

  //     // Clear form
  //     setForm({
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       phone: "",
  //       projectType: "",
  //       stoneInterest: "",
  //       vision: "",
  //     });
  //   } catch (error) {
  //     console.error("FAILED...", error);
  //     alert("Failed to send enquiry. Please try again.");
  //   }
  // };
  //   };
  const handleSubmit = async () => {
    // Validation
    if (!form.firstName || !form.email || !form.phone || !form.projectType) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      
const result = await emailjs.send(
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone,
    projectType: form.projectType,
    stoneInterest: form.stoneInterest,
    vision: form.vision,
    to_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  },
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
);
      console.log("SUCCESS:", result);

      alert("Enquiry submitted successfully!");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        projectType: "",
        stoneInterest: "",
        vision: "",
      });

    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send enquiry.");
    }
  };

    return (
      <section id="contact" className="contact-section">
        {/* LEFT SIDE */}
        <div className="contact-left">
          <p className="section-eyebrow">Get In Touch</p>

          <h2 className="section-title">
            Let's Build <br />
            <em>Something</em> Lasting
          </h2>

          <p className="section-lead">
            Whether you're an architect, builder, or homeowner — we're here to
            help you find the perfect stone for your vision.
          </p>

          <div className="contact-info">
            <div className="contact-row">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-label">Visit Us</div>
                <div className="contact-value">
                  42, Industrial Area, Peenya Phase 2
                  <br />
                  Bangalore – 560058, Karnataka
                </div>
              </div>
            </div>

            <div className="contact-row">
              <div className="contact-icon">📞</div>
              <div>
                <div className="contact-label">Call Us</div>
                <div className="contact-value">
                  +91 80 2839 5500
                  <br />
                  +91 98440 12345
                </div>
              </div>
            </div>

            <div className="contact-row">
              <div className="contact-icon">✉️</div>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">
                  hello@granitura.in
                  <br />
                  orders@granitura.in
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="contact-form">
          <div className="form-grid">
            <div className="form-row">
              <label>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Rajiv"
              />
            </div>

            <div className="form-row">
              <label>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Nair"
              />
            </div>
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="rajiv@company.com"
            />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98XXX XXXXX"
            />
          </div>

          <div className="form-row">
            <label>Project Type</label>
            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
            >
              <option value="">Select project type...</option>
              <option value="residential-interior">
                Residential — Interior
              </option>
              <option value="residential-exterior">
                Residential — Exterior
              </option>
              <option value="commercial-hospitality">
                Commercial — Hospitality
              </option>
              <option value="commercial-office">
                Commercial — Office
              </option>
              <option value="retail-showroom">Retail / Showroom</option>
              <option value="landscape-outdoor">Landscape / Outdoor</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <label>Stone Interest</label>
            <select
              name="stoneInterest"
              value={form.stoneInterest}
              onChange={handleChange}
            >
              <option value="">Which stone are you interested in?</option>
              <option value="italian-marble">
                Italian Marble (Carrara, Crema Marfil, Verde)
              </option>
              <option value="indian-granite">
                Indian Granite (Absolute Black, Multi-color)
              </option>
              <option value="bangalore-stone">Bangalore Stone (Cuddapah)</option>
              <option value="kota-stone">Kota Stone (Blue, Brown)</option>
              <option value="multiple">Multiple / Help me choose</option>
            </select>
          </div>

          <div className="form-row">
            <label>Your Vision</label>
            <textarea
              name="vision"
              value={form.vision}
              onChange={handleChange}
              placeholder="Tell us about your project — dimensions, usage, inspirations..."
            />
          </div>

          <button
            type="button"
            className="btn-submit"
            onClick={handleSubmit}
          >
            Send Enquiry →
          </button>
        </div>
      </section>
    );
  }