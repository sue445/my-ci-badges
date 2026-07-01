require "js"

def with_error
  yield
rescue Exception => e
  message = "#{e.class}: #{e.message}\n#{e.backtrace&.join("\n")}"
  JS.global[:console].error(message)
end

# fetch json file from remote
# @param filename [String]
# @yield [Object]
def fetch_json(filename)
  JS.global.fetch(filename) do |response|
    response.json.then do |js_object|
      yield js_object
    end
  end
end

# @param js_object [JS::Object]
# @return [Array]
def to_ruby_array(js_object)
  array = []

  0.upto(js_object[:length].to_i - 1) do |index|
    array << js_object[index]
  end

  array
end

# @param repo_url [String]
# @return [String]
def repo_icon(repo_url)
  case repo_url
  when %r{^https://github\.com/}
    "fa fa-github"
  when %r{^https://gitlab\.com/}
    "fa fa-gitlab"
  when %r{^https://bitbucket\.com/}
    "fa fa-bitbucket"
  else
    ""
  end
end

template = <<~HTML
  <div>
    <h1>{{ repositories.length }} repos statuses</h1>
    <div id="repositories">
      <div class="card" #each="repo in repositories">
        <div class="card-body">
          <h4 class="card-title">
            <i #if='repo.icon' class='{{ repo.icon }}' aria-hidden="true"></i>
            <a href='{{ repo.repo_url }}'>{{ repo.name }}</a>
          </h4>
          <span #each='badge in repo.badges'>
            <a href='{{ badge.url }}'><img src='{{ badge.img }}' /></a>
          </span>
        </div>
      </div>
    </div>
  </div>
HTML

state = {
  repositories: [],
}

fetch_json("config/repositories.json") do |data|
  with_error do
    array = to_ruby_array(data)
    array.each do |repo|
      matched = %r{/([-\w]+)/([-\w]+)$}.match(repo.repo_url)
      repo.name =
        if matched
          matched[2]
        else
          repo.repo_url
        end
      repo.icon = repo_icon(repo.repo_url)
    end
    state[:repositories] = array.sort{ |repo1, repo2| repo1.name <=> repo2.name }
  end
end

# Initialize and mount the application
RbWasmVdom.create_app("#app", template: template, state: state)
