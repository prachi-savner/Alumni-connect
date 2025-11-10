document.addEventListener("DOMContentLoaded", () => {
  // Fade in the hero section
  gsap.from(".hero h1", { duration: 1, y: -50, opacity: 0 });
  gsap.from(".hero p", { duration: 1, delay: 0.5, y: 30, opacity: 0 });

  // Stagger cards animation
  gsap.from(".card", {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".cards",
      start: "top 80%",
    },
  });
});
