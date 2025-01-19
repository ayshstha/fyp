import './Testimonial.css';

export default function Testimonial() {
  return (
    <section className="testimonial">
      <div className="testimonial-title">
        <h2>What Our Customers Say</h2>
        <p>Real experiences from our pet parents</p>
      </div>

      <div className="testimonial-grid">
        <div className="testimonial-card">
          <div className="testimonial-image">
            <img src="/testimonial.png" alt="Sarah Johnson" />
          </div>
          <div className="testimonial-content">
            <h3>Sarah Johnson</h3>
            <p className="testimonial-text">
              Our experience with the vet services was exceptional. Professional, caring, and thorough care for our rescue pup.
            </p>
          </div>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-image">
            <img src="/testimonial.png" alt="Michael Chen" />
          </div>
          <div className="testimonial-content">
            <h3>Michael Chen</h3>
            <p className="testimonial-text">
              The staff here truly understands pets and their needs. They made our visit comfortable and stress-free.
            </p>
          </div>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-image">
            <img src="/testimonial.png" alt="Emily Rodriguez" />
          </div>
          <div className="testimonial-content">
            <h3>Emily Rodriguez</h3>
            <p className="testimonial-text">
              Amazing service! They went above and beyond to help our elderly dog. Highly recommended!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
