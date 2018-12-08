import Text.ParserCombinators.ReadP
import System.Environment
import Data.List
import Data.Char

data Thingy = String deriving (Show)

validChar char = char /= '%' && char /= ' '
word = many1 $ satisfy validChar
manyWords = sepBy1 word (char ' ')

parsePair = do
  skipSpaces
  key <- between (char '%') (char '%') word
  skipSpaces
  value <- intercalate " " <$> manyWords
  skipSpaces
  return $ [key, value]
  
parseSyntax input 
  | null leftover = [pair]
  | otherwise = pair : parseSyntax leftover
  where (pair, leftover) = last $ readP_to_S parsePair input

main = parseSyntax . unwords <$> getArgs >>= print