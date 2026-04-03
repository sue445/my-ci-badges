const app = Vue.createApp({
  data() {
    return {
      repositories: [],
    };
  },
  methods: {
    async getRepositories() {
      const url = 'config/repositories.json';

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        this.repositories = data.map((repo) => {
          return this.convertRepository(repo);
        }).sort((a, b) => {
          return this.compareString(a.name, b.name);
        });

      } catch (error) {
        console.error('getRepositories is failed:', error);
      }
    },
    convertRepository(repo) {
      const matched = repo.repo_url.match(/\/([-\w]+)\/([-\w]+)$/);
      if (matched) {
        repo.name = matched[2];
      } else {
        repo.name = repo.repo_url;
      }

      // Font Awesome icon
      if (repo.repo_url.includes("github.com")) {
        repo.icon = "fa fa-github";
      } else if (repo.repo_url.includes("gitlab.com")) {
        repo.icon = "fa fa-gitlab";
      } else if (repo.repo_url.includes("bitbucket.com")) {
        repo.icon = "fa fa-bitbucket";
      }

      return repo;
    },
    compareString(a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    },
  },
  mounted() {
    this.getRepositories();
  },
});

app.mount('#app');
