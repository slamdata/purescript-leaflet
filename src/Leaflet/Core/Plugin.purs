module Leaflet.Core.Plugin
  ( onAddRemove
  ) where

import Prelude

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (class MonadEff, liftEff)
import Control.Monad.Eff.Ref (REF, Ref)

import Data.Function.Uncurried (Fn2, Fn3, Fn6, runFn6, mkFn2, mkFn3)
import Data.Maybe (Maybe(..))

import DOM (DOM)

import Leaflet.Core.Types as T

foreign import onAddRemove_
  ∷ ∀ e a
  . Fn6
      (Maybe a)
      (a → Maybe a)
      (Fn2 T.Layer T.Leaflet (Eff (dom ∷ DOM|e) a))
      (Fn3 T.Layer T.Leaflet (Maybe a) (Eff (dom ∷ DOM|e) Unit))
      T.Layer
      T.Leaflet
      (Eff (dom ∷ DOM, ref ∷ REF|e) (Ref (Maybe a)))

onAddRemove
  ∷ ∀ e a m
  . MonadEff (dom ∷ DOM, ref ∷ REF|e) m
  ⇒ (T.Layer → T.Leaflet → Eff (dom ∷ DOM|e) a)
  → (T.Layer → T.Leaflet → Maybe a → Eff (dom ∷ DOM|e) Unit)
  → T.Layer
  → T.Leaflet
  → m (Ref (Maybe a))
onAddRemove init finish l lf =
  liftEff $ runFn6 onAddRemove_ Nothing Just (mkFn2 init) (mkFn3 finish) l lf