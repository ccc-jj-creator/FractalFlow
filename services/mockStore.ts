import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';

class MockStore {
  private projects: Project[] = [...MOCK_PROJECTS];

  getProjects(): Project[] {
    return this.projects;
  }

  addProject(project: Project) {
    this.projects.unshift(project);
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }
}

export const store = new MockStore();