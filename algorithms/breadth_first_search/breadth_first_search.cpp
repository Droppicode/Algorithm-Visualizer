#include <iostream>
#include <queue>
#include <vector>
#include <fstream>
#include "../../libs/json/json.hpp" // Include a JSON library like nlohmann/json

using namespace std;
using json = nlohmann::json;

ofstream file("breadth_first_search_states.json");

vector<int> to_vector(queue<int> q) {
    vector<int> v;
    while (!q.empty()) {
        v.push_back(q.front());
        q.pop();
    }
    return v;
}

// BFS from given source s
void bfs(vector<vector<int>>& adj, int s) {
    queue<int> q;
    vector<int> visited(adj.size(), 0);
    visited[s] = 2;
    q.push(s);

    json state = {
        {"current", s},
        {"queue", {s}},
        {"visited", visited},
        {"log", "Starting BFS from: " + to_string(s)}
    };
    file << state.dump() << "," << endl;

    while (!q.empty()) {
        int curr = q.front();
        visited[curr] = 2;
        q.pop();

        state = {
            {"current", curr},
            {"queue", to_vector(q)},
            {"visited", visited},
            {"log", "Current node: " + to_string(curr)}
        };

        if(curr != 0) file << state.dump() << "," << endl; // Output the current state as JSON

        vector<int> vis;
        for (int x : adj[curr]) {
            if (!visited[x]) {
                visited[x] = 1;
                vis.push_back(x);
                q.push(x);
            }
        }
        string log = "";
        if(vis.size()) log = "Adding neighbors ";
        else log = "No new neighbors to add";
        for(int i = 0; i<vis.size(); i++) {
            log += to_string(vis[i]);
            if(i != vis.size()-1) log += ", ";  
        }

        state = {
            {"current", curr},
            {"queue", to_vector(q)},
            {"visited", visited},
            {"log", log}
        };
        file << state.dump() << "," << endl;
    }

    state = {
        {"current", -1},
        {"queue", {}},
        {"visited", visited},
        {"log", "BFS completed"}
    };
    file << state.dump() << endl;
}

void addEdge(vector<vector<int>>& adj, int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u); 
}

int main() {
    file << "[" << endl;  // Start JSON array

    // Read configuration file
    ifstream config_file("breadth_first_search_config.json");
    json config;
    config_file >> config;

    int V = config["n_vertices"];
    vector<vector<int>> adj(V);

    for(const auto& edge : config["edges"]) 
        addEdge(adj, edge["source"], edge["destination"]);

    bfs(adj, config["start"]);

    file << "]" << endl;  // End JSON array
    file.close();

    return 0;
}