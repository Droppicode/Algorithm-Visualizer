#include <iostream>
#include <queue>
#include <vector>
#include <climits>
#include <fstream>
#include "../../libs/json/json.hpp" // Include a JSON library like nlohmann/json

using namespace std;
using json = nlohmann::json;

ofstream file("dijkstra_states.json");

vector<int> to_vector(priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> q) {
    vector<int> v;
    while (!q.empty()) {
        v.push_back(q.top()[1]);
        q.pop();
    }
    return v;
}

// Returns shortest distances from src to all other vertices
vector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int src) {
    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> pq;

    vector<int> dist(V, INT_MAX);

    pq.push({ 0, src });
    dist[src] = 0;

    json state = {
        {"current", src},
        {"queue", {-1}},
        {"dist", dist},
        {"log", "Starting Dijkstra from: " + to_string(src)}
    };
    file << state.dump() << "," << endl;

    while (!pq.empty()) {
        int u = pq.top()[1];
        pq.pop();

        state = {
            {"current", u},
            {"queue", to_vector(pq)},
            {"dist", dist},
            {"log", "Corrent node: " + to_string(u)}
        };
        if (u != src) file << state.dump() << "," << endl;

        for (auto x : adj[u]) {
            int v = x.first;
            int weight = x.second;

            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                pq.push({ dist[v], v });
                state = {
                    {"current", u},
                    {"queue", to_vector(pq)},
                    {"dist", dist},
                    {"log", "Update distance to " + to_string(v) + " and add to queue"}
                };
                file << state.dump() << "," << endl;
            }
            else {
                state = {
                    {"current", u},
                    {"queue", to_vector(pq)},
                    {"dist", dist},
                    {"log", "Dont update distance to " + to_string(v)}
                };
                file << state.dump() << "," << endl;
            }
        }
    }

    state = {
        {"current", -1},
        {"queue", {-1}},
        {"dist", dist},
        {"log", "Dijkstra completed"}
    };
    file << state.dump() << endl;

    return dist;
}

void addEdge(vector<vector<pair<int, int>>>& adj, int u, int v, int w) {
    adj[u].push_back({ v, w });
    adj[v].push_back({ u, w });
}

int main() {
    file << "[" << endl;  // Start JSON array

    // Read configuration file
    ifstream config_file("dijkstra_config.json");
    json config;
    config_file >> config;

    int V = config["n_vertices"];
    vector<vector<pair<int, int>>> adj(V);

    for (const auto& edge : config["edges"])
        addEdge(adj, edge["source"], edge["destination"], edge["weight"]);

    dijkstra(config["n_vertices"], adj, config["start"]);

    file << "]" << endl;  // End JSON array
    file.close();

    return 0;
}
