import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "../data";
import s from "../App.module.css";
export default function ContactForm() {
  const [status, setStatus] = useState("");
  return (
    <form
      className={s.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.reportValidity())
          setStatus(
            "Your brief is ready. This is a demo — nothing has been sent or stored. You can copy it into your email to a studio of your choice.",
          );
      }}
    >
      <div className={s.formIntro}>
        <span className={s.eyebrow}>YOUR NEXT BIG THING STARTS HERE</span>
        <p>Tell us what you have in mind.</p>
      </div>
      <label>
        Name{" "}
        <input
          name="name"
          autoComplete="name"
          placeholder="Your name"
          required
          minLength={2}
          maxLength={100}
        />
      </label>
      <label>
        Email{" "}
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          maxLength={254}
        />
      </label>
      <label>
        Project type{" "}
        <select name="type" required defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((x) => (
            <option key={x.name}>{x.name}</option>
          ))}
          <option>Something different</option>
        </select>
      </label>
      <label>
        Budget{" "}
        <select name="budget" required defaultValue="">
          <option value="" disabled>
            Select a range
          </option>
          <option>$5,000–$10,000</option>
          <option>$10,000–$20,000</option>
          <option>$20,000–$50,000</option>
          <option>$50,000+</option>
          <option>Let’s discuss</option>
        </select>
      </label>
      <label className={s.message}>
        Message{" "}
        <textarea
          name="message"
          placeholder="The idea. The ambition. The beautifully impossible."
          required
          minLength={10}
          maxLength={5000}
          rows={3}
        />
      </label>
      <div className={s.formEnd}>
        <p>DEMO FORM — NO DATA IS SENT OR STORED.</p>
        <button type="submit" className={s.submit}>
          REVIEW MY BRIEF <ArrowUpRight size={20} />
        </button>
      </div>
      <p className={s.status} role="status">
        {status}
      </p>
    </form>
  );
}
