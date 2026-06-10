const express = require("express");
const cors = require("cors");
const contactRoute = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/contact", contactRoute);

app.get("/api/projects", (req, res) => {
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      category: "Frontend Development",
      year: "2026",
      description:
        "Designed and developed a modern, responsive portfolio website to showcase projects, technical skills, internship experience, and research work. Built with React and Tailwind CSS, featuring smooth animations, interactive UI components, and optimized performance across devices.",
      tags: ["React", "JavaScript", "Tailwind CSS", "GIT"],
      color: "#2563FF",
    },
    {
      id: 2,
      title: "Coverless Image Steganography",
      category: "Research Project",
      year: "2025",
      description:
        "Conducted research and developed a cloud-enabled coverless image steganography system for secure data transmission. The solution combines computer vision techniques, feature-based image mapping, and AWS cloud services to enhance security while preserving image integrity.",
      tags: ["Python", "OpenCV", "AWS", "S3", "Lambda"],
      color: "#0b0909",
    },
    {
      id: 3,
      title: "Multi-Waveform Generator",
      category: "Embedded Systems",
      year: "2024",
      description:
        "A comprehensive design system and component library used across 4 enterprise products. 200+ components, full a11y compliance.",
      tags: ["STM32CubeIDE", "Embedded C", "HAL", "UART", "Sensors", "Oscilloscope"],
      color: "#00C896",
    },
    {
      id: 4,
      title: "Wagan Shop",
      category: "E-Commerce",
      year: "2021",
      description:
        "Built a full-stack e-commerce application during my internship, implementing React-based front-end interfaces, Node.js APIs, MongoDB database integration, user authentication, and efficient product catalog management.",
      tags: ["HTML", "CSS", "React", "JavaSceipt", "Node.js", "MongoDB"],
      color: "#FF9500",
    },
  ];
  res.json(projects);
});

app.get("/api/skills", (req, res) => {
  const skills = {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Responsive Design"],
    backend: ["Node.js", "Express.js", "REST APIs", "JWT Authentication"],
    database: ["MongoDB", "MySQL", "AWS S3", "AWS Lambda"],
    tools: ["Git", "GitHub", "AWS", "OpenCV","Postman"]
  };

  res.json(skills);
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio server running at http://localhost:${PORT}`);
});
