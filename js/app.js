const app = new Vue({
  el: '#app',
  data: {
    repositories: []
  },
  methods: {
    getRepositories() {
      const url = 'config/repositories.json';
      axios.get(url).then(x => {
        this.repositories = x.data.
          map(repo => { return this.convertRepository(repo) }).
          sort((a, b) => { return this.compareString(a.name, b.name) });
      });
    },
    convertRepository(repo) {
      const matched = repo.repo_url.match(/\/([-\w]+)\/([-\w]+)$/);
      if (matched) {
        repo.name = matched[2];
      } else {
        repo.name = repo.repo_url;
      }

      // font-awesome icon
      if(repo.repo_url.includes("github.com")){
        repo.icon = "fa fa-github";
      } else if (repo.repo_url.includes("gitlab.com")) {
        repo.icon = "fa fa-gitlab";
      }

      return repo;
    },
    compareString(a, b) {
      if(a < b){
        return -1;
      }
      if(a > b){
        return 1;
      }
      return 0;
    }
  },
  mounted() {
    this.getRepositories();
  }
});
