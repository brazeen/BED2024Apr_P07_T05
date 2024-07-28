const Chat = require("../models/chat");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library