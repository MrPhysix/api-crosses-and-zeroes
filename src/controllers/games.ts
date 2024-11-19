import { RequestHandler, Response } from 'express';
import { PrismaClient, WinnerStatus } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient();

export const createGame: RequestHandler = async (req, res): Promise<void> => {
  console.log(WinnerStatus.InProgress);
  try {
    let { ip } = req;
    if (!ip || typeof ip !== 'string') {
      res.status(400).send({ message: 'Valid IP address is required' });
      return;
    }
    const isGameExists = await prisma.gameState.findUnique({
      where: {
        ipAdress: ip,
      },
    });

    if (isGameExists) {
      res.status(409).send({
        message: 'GameSession with current IP address already exists',
        game: isGameExists,
      });
      return;
    }

    const game = await prisma.gameState.create({
      data: {
        ipAdress: ip,
        history: {
          create: [],
        },
      },
    });

    res.status(200).send({
      message: `[createGame] Your game's been created`,
      game,
    });
  } catch (err) {
    res.status(400).send({
      error: '[createGame] Invalid body data',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllGames: RequestHandler = async (req, res): Promise<void> => {
  try {
    const gamesList = await prisma.gameState.findMany({
      include: {
        history: {
          include: { sections: true },
        },
      },
    });

    if (!gamesList || gamesList.length < 1) {
      res.status(400).send({
        error: '[getAllGames] List of games is empty',
      });
      return;
    }
    res.status(200).send({
      gamesList,
    });
  } catch (err) {
    res.status(400).send({
      error: '[getAllGames] Something goes wrong',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getGame: RequestHandler = async (req, res): Promise<void> => {
  const requestedIp = req.params.ip;

  try {
    const game = await prisma.gameState.findUnique({
      where: {
        ipAdress: requestedIp,
      },
      include: {
        history: {
          select: {
            playerMoved: true,
            sections: {
              select: { value: true },
            },
          },
        },
      },
    });
    if (!game) {
      res.status(404).send({
        error: `[getGame] There's no such game related with IP: '${requestedIp}'`,
      });
      return;
    }
    res.status(200).send(game);
  } catch (err) {
    res.status(400).send({
      error: '[getGame] Invalid body data',
    });
  } finally {
    await prisma.$disconnect();
  }
};

//

export const updateGame: RequestHandler = async (req, res): Promise<void> => {
  const requestedIp = req.params.ip;
  const { currentMove, status, playerMoved, sections } = req.body;

  const statusEnum = status as WinnerStatus;

  console.log([updateGame], req.body);

  // if (!Object.values(WinnerStatus).includes(statusEnum)) {
  //   res.status(400).send({ error: `Invalid status value: ${status}` });
  //   return;
  // }

  try {
    if (!sections || !Array.isArray(sections)) {
      res.status(400).send({ error: 'Sections must be a valid array' });
      return;
    }

    if (typeof currentMove !== 'number') {
      res.status(400).send({ error: 'currentMove must be a number' });
      return;
    }

    const game = await prisma.gameState.findUnique({
      where: {
        ipAdress: requestedIp,
      },
      include: {
        history: {
          select: {
            playerMoved: true,
            sections: {
              select: { value: true },
            },
          },
        },
      },
    });

    if (!game) {
      res.status(404).send({
        error: `[updateGame] There's no such game related with IP: '${requestedIp}'`,
      });
      return;
    }
    const sectionData = sections.map((value: boolean | null) => ({ value }));

    const updatedHistory = game.history
      .slice(0, currentMove - 1)
      .map((historyStep) => ({
        playerMoved: historyStep.playerMoved,
        sections: historyStep.sections,
      }));

    updatedHistory.push({
      playerMoved,
      sections: sectionData,
    });

    const deleteHistory = await prisma.historyStep.deleteMany({
      where: {
        gameStateId: game.id,
      },
    });

    const updatedGame = await prisma.gameState.update({
      where: {
        ipAdress: requestedIp,
      },
      data: {
        history: {
          // deleteMany: {}, // wipe history
          create: updatedHistory.map((step) => ({
            playerMoved: step.playerMoved,
            sections: {
              create: step.sections,
            },
          })),
        },
        currentMove,
        status: statusEnum,
      },
      include: {
        history: {
          include: { sections: true },
        },
      },
    });

    res.status(200).send({
      message: `[updateGame] Game of IP: '${requestedIp}' has been successfully updated`,
      game: updatedGame,
    });
  } catch (err) {
    console.log(err);

    res.status(400).send({
      error: '[updateGame] Invalid body data',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const removeGame: RequestHandler = async (req, res): Promise<void> => {
  const requestedIp = req.params.ip;

  try {
    const game = await prisma.gameState.findUnique({
      where: {
        ipAdress: requestedIp,
      },
    });
    if (!game) {
      res.status(404).send({
        error: `[removeGame] There's no such game related to IP: '${requestedIp}'`,
      });
      return;
    }
    await prisma.section.deleteMany({
      where: {
        HistoryStep: {
          GameState: {
            ipAdress: requestedIp,
          },
        },
      },
    });

    await prisma.historyStep.deleteMany({
      where: {
        gameStateId: game.id,
      },
    });

    const removedGame = await prisma.gameState.delete({
      where: {
        ipAdress: requestedIp,
      },
    });
    res.status(200).send({
      message: `[removeGame] Game of IP: '${requestedIp}' has been successfully removed`,
      game: removeGame,
    });
  } catch (err) {
    res.status(400).send({
      error: '[removeGame] Something goes wrong',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const wipeInfo: RequestHandler = async (req, res): Promise<void> => {
  try {
    await prisma.gameState.deleteMany();
    await prisma.historyStep.deleteMany();
    await prisma.section.deleteMany();
    res.status(200).send({
      message: 'All data has been wiped out',
    });
  } catch (err) {
    res.status(400).send({
      error: '[wipeInfo] Something goes wrong',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getIpAdress: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { ip } = req;

    res.status(200).send({ currentIpAdress: ip });
  } catch (err) {
    res.status(400).send({
      error: '[wipeInfo] Something goes wrong',
    });
  }
};
