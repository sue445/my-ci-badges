var app = new Vue({
  el: '#app',
  data: {
    repositories: []
  },
  methods: {
    getRepositories: function () {
      var url = 'config/repositories.json';
      var that = this;
      axios.get(url).then(function (x) {
        that.repositories = x.data.map(function (repo) {
          return that.convertRepository(repo);
        }).sort(function (a, b) {
          return that.compareString(a.name, b.name);
        });
      });
    },
    convertRepository: function (repo) {
      var matched = repo.repo_url.match(/\/([-\w]+)\/([-\w]+)$/);
      if (matched) {
        repo.name = matched[2];
      } else {
        repo.name = repo.repo_url;
      }

      // font-awesome icon
      if (repo.repo_url.includes("github.com")) {
        repo.icon = "fa fa-github";
      } else if (repo.repo_url.includes("gitlab.com")) {
        repo.icon = "fa fa-gitlab";
      } else if (repo.repo_url.includes("bitbucket.com")) {
        repo.icon = "fa fa-bitbucket";
      }

      return repo;
    },
    compareString: function (a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }
  },
  mounted: function () {
    this.getRepositories();
  }
});
