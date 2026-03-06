export interface TechItem {
  name: string;
  version: string;
  role: string;
}

export interface TimeEntry {
  task: string;
  hours: number;
  description: string;
}

export interface DockerService {
  name: string;
  desc: string;
}

export interface ApproachCard {
  title: string;
  body: string;
}
