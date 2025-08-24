use axum::{routing::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/health", get(|| async { "ok" }));

    let addr = SocketAddr::from(([127, 0, 0, 1], 4000));
    println!("[rust-engine] listening on http://{addr}");
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}


