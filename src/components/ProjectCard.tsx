import GlassCard from "@/components/ui/GlassCard";

interface ProjectCardProps {
  title: string;
  summary: string;
  tags: string[];
}

export default function ProjectCard({ title, summary, tags }: ProjectCardProps) {
  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs text-cyan">
            {tag}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
