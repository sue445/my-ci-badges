const app = new Vue({
  el: '#app',
  data: {
    repositories: []
  },
  methods: {
    getRepositories() {
      const url = 'config/repositories.json';
      const that = this;
      axios.get(url).then(function (x) {
        that.repositories = x.data.map(function (repo) {
          return that.convertRepository(repo);
        }).sort(function (a, b) {
          return that.compareString(a.name, b.name);
        });
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
      } else if (repo.repo_url.includes("bitbucket.com")) {
        repo.icon = "fa fa-bitbucket";
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
