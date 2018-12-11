defmodule BackendWeb.DeckChannel do
  use Phoenix.Channel
  import Ecto.Query, only: [from: 2]
  alias Backend.Deck, as: Deck
  alias Backend.Repo, as: Repo

  def join("deck:main", _message, socket) do
    last_deck = Repo.one(from x in Deck, order_by: [desc: x.id], limit: 1)
    if last_deck do
      {:ok, %{body: Jason.encode!(last_deck.state)}, socket}
    else
      {:ok, %{body: Jason.encode!(%{a1: 0})}, socket}
    end
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    deck = %Deck{state: Jason.decode!(body)}
    Repo.insert!(deck)
    broadcast!(socket, "new_msg", %{body: Jason.encode!(deck.state)})
    {:noreply, socket}
  end
end