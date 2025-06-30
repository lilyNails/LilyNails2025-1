// Check if we are on a page with the order form
const sendBtn = document.getElementById("send-btn");

if (sendBtn) {
  // Nail measurement validation
  const nailMeasurements = document.getElementById("nail-measurements");
  const shapeRadios = document.querySelectorAll('input[name="shape"]');

  function validateForm() {
    const measurementsValid = nailMeasurements.value.trim() !== "";
    let shapeSelected = false;
    shapeRadios.forEach(radio => {
      if (radio.checked) {
        shapeSelected = true;
      }
    });
    const valid = measurementsValid && shapeSelected;
    sendBtn.disabled = !valid;
  }

  nailMeasurements.addEventListener("input", validateForm);
  shapeRadios.forEach(radio => {
    radio.addEventListener("change", validateForm);
  });

  // WhatsApp message generation
  sendBtn.addEventListener("click", () => {
    const shape = document.querySelector('input[name="shape"]:checked').value;
    const measurements = nailMeasurements.value;
    const message = `مرحباً، أود طلب أظافر بالمقاسات التالية:\n\nالمقاسات: ${measurements}\nالشكل: ${shape}`;
    const whatsappUrl = `https://wa.me/966505505505?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  });

  // Initialize form validation
  validateForm();
}

// Counter animation (this can run on any page where the counter exists)
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const counter = document.getElementById("customer-count");
if (counter) {
  animateValue(counter, 0, 150, 2000); // Animate from 0 to 150 over 2 seconds
}
