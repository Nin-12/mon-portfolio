import React, { useState } from 'react';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [flipped, setFlipped] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <>
      {/* ================= OVERLAY ZOOM ================= */}
      {hoveredImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center pointer-events-none">
          <img
            src={hoveredImage}
            alt="Zoom"
            className="
              max-w-[90vw]
              max-h-[90vh]
              object-contain
              rounded-xl
              shadow-2xl
              transition-transform
              duration-200
              scale-100
            "
          />
        </div>
      )}

      {/* ================= CARD ================= */}
      <div className="w-full flex justify-start">
        <div
          className="max-w-[280px] w-full perspective cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-80 transition-transform duration-500 transform-style-preserve-3d ${
              flipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* ================= FRONT ================= */}
            <div className="absolute inset-0 backface-hidden bg-[var(--card)] rounded-xl p-4 flex flex-col items-center">
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-sm text-[var(--muted)]">{project.category}</p>
            </div>

            {/* ================= BACK ================= */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[var(--card)] rounded-xl p-4 overflow-y-auto">
              <h3 className="text-lg font-bold mb-2">{project.title}</h3>
              <p className="text-sm mb-4">{project.description}</p>

              {/* ================= IMAGES ================= */}
              <div className="flex flex-wrap gap-3 mb-5">
                {project.images?.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-16 h-16 rounded-lg overflow-hidden border border-[var(--glass)] shadow-sm"
                    onMouseEnter={() => setHoveredImage(img)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img
                      src={img}
                      alt={`${project.title}-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* ================= LIENS ================= */}
              <div className="flex flex-col gap-3">
                {project.pdf && (
                  <a
                    href={project.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Voir le PDF
                  </a>
                )}

                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[var(--accent)] font-semibold hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.02 10.02 0 0022 12.017C22 6.484 17.523 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Voir sur GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
