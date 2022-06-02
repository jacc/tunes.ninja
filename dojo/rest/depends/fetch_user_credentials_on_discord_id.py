from dojo.clients.mongo_clients import return_odmantic_mongo
from fastapi import Body, Depends, HTTPException, Path, Query
from loguru import logger
import typing


async def main_function_return_discord_id(discord_id: str):
    logger.info(f"Fetching discord information for user {discord_id}")


async def fetch_discord_id_from_path_parameter(
    discord_id: str,
):
    return await main_function_return_discord_id(discord_id)


async def fetch_discord_id_from_query_parameter(
    discord_id: str = Query(alias="discordId"),
):
    return await main_function_return_discord_id(discord_id)


async def fetch_discord_id_from_incoming_body(
    incoming: dict = Body(),
):
    if "discordId" in incoming:
        return await main_function_return_discord_id(incoming["discordId"])
    elif "discord_id" in incoming:
        return await main_function_return_discord_id(incoming["discord_id"])
